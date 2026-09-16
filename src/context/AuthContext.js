"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const AuthContext = createContext(undefined);
const OWNER_ADMIN_EMAIL = "vasiliy2197463@gmail.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    const timeout = setTimeout(() => { if (active) setLoading(false); }, 8000);
    supabase.auth.getUser()
      .then(({ data }) => { if (active) setUser(data.user || null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => { active = false; clearTimeout(timeout); data.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    let active = true;
    if (!supabase || !user) {
      setProfile(null);
      setProfileLoading(false);
      return () => { active = false; };
    }

    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data || null);
        setProfileLoading(false);
      })
      .catch(() => { if (active) setProfileLoading(false); });

    const timeout = setTimeout(() => { if (active) setProfileLoading(false); }, 8000);

    return () => { active = false; clearTimeout(timeout); };
  }, [supabase, user]);

  const signUp = (email, password, fullName) => supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/account/` } });
  const signOut = () => supabase.auth.signOut();
  const resetPassword = (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/account/` });
  const updateCustomerDetails = async (details) => {
    const { data, error } = await supabase.auth.updateUser({ data: details });
    if (!error) setUser(data.user);
    return { data, error };
  };

  const isAdmin = profile?.role === "admin";
  const isOwnerAdmin = isAdmin && user?.email?.toLowerCase() === OWNER_ADMIN_EMAIL;

  return <AuthContext.Provider value={{ user, profile, isAdmin, isOwnerAdmin, loading: loading || profileLoading, configured: Boolean(supabase), signUp, signIn, signInWithGoogle, signOut, resetPassword, updateCustomerDetails }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
