"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, profile, isOwnerAdmin, loading, configured, signOut } = useAuth();
  if (loading) return <main className="container-main min-h-[50vh] py-20 text-center">Loading…</main>;
  if (!configured || !user) return (
    <main className="container-main flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
      <h1 className="font-integral text-3xl font-bold md:text-5xl">MY ACCOUNT</h1>
      <p className="mt-3 text-black/55">Sign in to view your profile and orders.</p>
      <Link href="/signup" className="mt-7 rounded-full bg-black px-9 py-3.5 font-semibold text-white">Sign in or create account</Link>
    </main>
  );
  return (
    <main className="container-main py-12 md:py-20">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="text-sm text-black/45">SHOP.CO ACCOUNT</div><h1 className="mt-2 font-integral text-3xl font-bold">{profile?.full_name || user.user_metadata?.full_name || "My Account"}</h1><p className="mt-2 text-black/55">{user.email}</p></div><div className="flex flex-col gap-3 sm:items-end">{isOwnerAdmin && <Link href="/admin" className="rounded-full bg-black px-6 py-3 text-center font-semibold text-white hover:bg-black/80">Admin panel</Link>}<button onClick={signOut} className="rounded-full border border-black/15 bg-white px-6 py-3 font-semibold">Sign out</button></div></div>
        <div className="mt-8 rounded-3xl bg-white p-6"><h2 className="text-xl font-bold">Your orders</h2><p className="mt-2 text-black/50">No orders yet.</p></div>
      </div>
    </main>
  );
}
