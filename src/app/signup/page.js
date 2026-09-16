"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { configured, signUp, signIn, resetPassword } = useAuth();
  const { language } = useLanguage();
  const ru = language === "ru";
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const { data, error } = await (mode === "signup" ? signUp(form.email, form.password, form.name) : signIn(form.email, form.password));
    setBusy(false);
    if (error) return setMessage(error.message);
    if (mode === "signup" && !data.session) return setMessage(ru ? "Проверьте почту и подтвердите регистрацию." : "Check your email and confirm your registration.");
    router.push("/account");
  };
  const recover = async () => {
    if (!form.email) return setMessage(ru ? "Сначала укажите email." : "Enter your email first.");
    const { error } = await resetPassword(form.email);
    setMessage(error ? error.message : ru ? "Ссылка для восстановления отправлена на почту." : "A password recovery link has been sent to your email.");
  };
  return (
    <main className="container-main py-12 md:py-20">
      <div className="mx-auto max-w-md rounded-[32px] border border-black/10 bg-white p-6 shadow-xl md:p-9">
        <h1 className="font-integral text-3xl font-bold">{mode === "signup" ? (ru ? "СОЗДАТЬ АККАУНТ" : "CREATE ACCOUNT") : (ru ? "ВОЙТИ" : "SIGN IN")}</h1>
        <p className="mt-2 text-black/50">{mode === "signup" ? (ru ? "Создайте аккаунт, чтобы отслеживать заказы и сохранять корзину." : "Create an account to track orders and save your cart.") : (ru ? "С возвращением в SHOP.CO." : "Welcome back to SHOP.CO.")}</p>
        {!configured && <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm">{ru ? "Supabase не настроен." : "Supabase is not configured."}</div>}
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === "signup" && <input required placeholder={ru ? "Имя и фамилия" : "Full name"} value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />}
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />
          <input required minLength={8} type="password" placeholder={ru ? "Пароль" : "Password"} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />
          {message && <div className="rounded-2xl bg-[#f2f2f2] p-3 text-sm">{message}</div>}
          <button disabled={busy || !configured} className="w-full rounded-full bg-black py-3.5 font-semibold text-white disabled:opacity-40">{busy ? (ru ? "Подождите…" : "Please wait…") : mode === "signup" ? (ru ? "Создать аккаунт" : "Create account") : (ru ? "Войти" : "Sign in")}</button>
        </form>
        <button disabled className="mt-3 w-full rounded-full border border-black/15 py-3.5 font-semibold opacity-40">{ru ? "Вход через Google — скоро" : "Google sign-in — coming soon"}</button>
        {mode === "signin" && <button onClick={recover} className="mt-4 w-full text-sm underline">{ru ? "Забыли пароль?" : "Forgot password?"}</button>}
        <button onClick={()=>{setMode(mode === "signup" ? "signin" : "signup");setMessage("");}} className="mt-5 w-full text-sm text-black/60 underline">{mode === "signup" ? (ru ? "Уже есть аккаунт? Войти" : "Already have an account? Sign in") : (ru ? "Впервые в SHOP.CO? Создать аккаунт" : "New to SHOP.CO? Create account")}</button>
      </div>
    </main>
  );
}
