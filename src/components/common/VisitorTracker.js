"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const detectSource = (referrer, params) => {
  const campaignSource = params.get("utm_source")?.trim();
  if (campaignSource) return campaignSource;
  const value = (referrer || "").toLowerCase();
  if (/t\.me|telegram|telegram\.me/.test(value)) return "Telegram";
  if (/instagram|l\.instagram/.test(value)) return "Instagram";
  if (/vk\.com|vkontakte/.test(value)) return "VK";
  if (/google\./.test(value)) return "Google";
  if (/yandex\./.test(value)) return "Яндекс";
  if (!value) return "Прямой вход";
  try { return new URL(referrer).hostname.replace(/^www\./, ""); } catch { return "Другая ссылка"; }
};

export default function VisitorTracker() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !pathname || pathname.includes("/admin")) return;

    let visitorId = localStorage.getItem("luchik_visitor_id");
    if (!visitorId) {
      visitorId = makeId();
      localStorage.setItem("luchik_visitor_id", visitorId);
    }
    let sessionId = sessionStorage.getItem("luchik_session_id");
    if (!sessionId) {
      sessionId = makeId();
      sessionStorage.setItem("luchik_session_id", sessionId);
    }

    const eventKey = `luchik_last_event_${pathname}`;
    const lastEvent = Number(sessionStorage.getItem(eventKey) || 0);
    if (Date.now() - lastEvent < 30000) return;
    sessionStorage.setItem(eventKey, String(Date.now()));

    const params = new URLSearchParams(window.location.search);
    const storedAcquisition = sessionStorage.getItem("luchik_acquisition");
    let acquisition;
    if (storedAcquisition) {
      try { acquisition = JSON.parse(storedAcquisition); } catch { acquisition = null; }
    }
    if (!acquisition) {
      acquisition = {
        source: detectSource(document.referrer, params),
        referrer: document.referrer || null,
        landing_page: `${window.location.pathname}${window.location.search}`,
        utm_source: params.get("utm_source") || null,
        utm_medium: params.get("utm_medium") || null,
        utm_campaign: params.get("utm_campaign") || null,
        utm_content: params.get("utm_content") || null,
      };
      sessionStorage.setItem("luchik_acquisition", JSON.stringify(acquisition));
    }

    const width = window.innerWidth;
    const device = width < 768 ? "Телефон" : width < 1100 ? "Планшет" : "Компьютер";
    supabase.rpc("record_visitor_event", {
      p_visitor_id: visitorId,
      p_session_id: sessionId,
      p_visitor_email: user?.email || null,
      p_path: pathname,
      p_referrer: acquisition.referrer,
      p_source: acquisition.source,
      p_landing_page: acquisition.landing_page,
      p_query_string: window.location.search || null,
      p_utm_source: acquisition.utm_source,
      p_utm_medium: acquisition.utm_medium,
      p_utm_campaign: acquisition.utm_campaign,
      p_utm_content: acquisition.utm_content,
      p_device: device,
      p_user_agent: navigator.userAgent,
    }).then(({ error }) => {
      // Older database schemas keep collecting the basic event until the migration is applied.
      if (error) supabase.from("visitor_events").insert({
        visitor_id: visitorId, session_id: sessionId, user_id: user?.id || null,
        visitor_email: user?.email || null, path: pathname,
        referrer: acquisition.referrer, device, user_agent: navigator.userAgent,
      }).then(() => {});
    });
  }, [pathname, user?.id, user?.email]);

  return null;
}
