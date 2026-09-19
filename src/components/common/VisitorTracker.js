"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

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

    const width = window.innerWidth;
    const device = width < 768 ? "Телефон" : width < 1100 ? "Планшет" : "Компьютер";
    supabase.from("visitor_events").insert({
      visitor_id: visitorId,
      session_id: sessionId,
      user_id: user?.id || null,
      visitor_email: user?.email || null,
      path: pathname,
      referrer: document.referrer || null,
      device,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, [pathname, user?.id, user?.email]);

  return null;
}
