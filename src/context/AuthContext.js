"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user || null); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const signUp = (email, password, fullName) => supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/account/` } });
  const signOut = () => supabase.auth.signOut();
  const resetPassword = (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/account/` });

  return <AuthContext.Provider value={{ user, loading, configured: Boolean(supabase), signUp, signIn, signInWithGoogle, signOut, resetPassword }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
