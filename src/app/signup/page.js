"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { configured, signUp, signIn, resetPassword, updatePassword } = useAuth();
  const { language } = useLanguage();
  const ru = language === "ru";
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "recovery") setMode("recovery");
  }, []);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage(""); setMessageError(false);
    if (mode === "recovery") {
      if (form.password !== passwordConfirmation) { setBusy(false); setMessageError(true); return setMessage(ru ? "Пароли не совпадают." : "Passwords do not match."); }
      const { error } = await updatePassword(form.password);
      setBusy(false);
      if (error) { setMessageError(true); return setMessage(error.message); }
      setMessage(ru ? "Пароль изменён. Теперь можно перейти в личный кабинет." : "Password updated. You can now open your account.");
      return;
    }
    const { data, error } = await (mode === "signup" ? signUp(form.email, form.password, form.name) : signIn(form.email, form.password));
    setBusy(false);
    if (error) { setMessageError(true); return setMessage(error.message); }
    if (mode === "signup" && !data.session) return setMessage(ru ? "Проверьте почту и подтвердите регистрацию." : "Check your email and confirm your registration.");
    router.push("/account");
  };
  const recover = async () => {
    if (!form.email) { setMessageError(true); return setMessage(ru ? "Сначала укажите email." : "Enter your email first."); }
    const { error } = await resetPassword(form.email);
    setMessageError(Boolean(error));
    setMessage(error ? error.message : ru ? "Ссылка для восстановления отправлена на почту." : "A password recovery link has been sent to your email.");
  };
  return (
    <main className="container-main py-12 md:py-20">
      <div className="mx-auto max-w-md rounded-[32px] border border-black/10 bg-white p-6 shadow-xl md:p-9">
        <h1 className="font-integral text-3xl font-bold">{mode === "recovery" ? (ru ? "НОВЫЙ ПАРОЛЬ" : "NEW PASSWORD") : mode === "signup" ? (ru ? "СОЗДАТЬ АККАУНТ" : "CREATE ACCOUNT") : (ru ? "ВОЙТИ" : "SIGN IN")}</h1>
        <p className="mt-2 text-black/50">{mode === "recovery" ? (ru ? "Придумайте новый пароль для своего аккаунта." : "Choose a new password for your account.") : mode === "signup" ? (ru ? "Создайте аккаунт, чтобы отслеживать заказы и сохранять корзину." : "Create an account to track orders and save your cart.") : (ru ? "С возвращением в SHOP.CO." : "Welcome back to SHOP.CO.")}</p>
        {!configured && <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm">{ru ? "Supabase не настроен." : "Supabase is not configured."}</div>}
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === "signup" && <input required placeholder={ru ? "Имя и фамилия" : "Full name"} value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />}
          {mode !== "recovery" && <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />}
          <div><input required minLength={8} type="password" placeholder={ru ? "Пароль" : "Password"} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" /><p className="mt-2 px-3 text-xs text-black/45">{ru ? "Не менее 8 символов" : "At least 8 characters"}</p></div>
          {mode === "recovery" && <input required minLength={8} type="password" placeholder={ru ? "Повторите новый пароль" : "Repeat new password"} value={passwordConfirmation} onChange={(e)=>setPasswordConfirmation(e.target.value)} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3.5" />}
          {message && <div role="alert" className={`rounded-2xl p-3 text-sm ${messageError ? "bg-red-100 text-red-800 ring-1 ring-red-300" : "bg-[#d7ff5f] text-black"}`}>{message}</div>}
          <button disabled={busy || !configured} className="w-full rounded-full bg-black py-3.5 font-semibold text-white disabled:opacity-40">{busy ? (ru ? "Подождите…" : "Please wait…") : mode === "recovery" ? (ru ? "Сохранить новый пароль" : "Save new password") : mode === "signup" ? (ru ? "Создать аккаунт" : "Create account") : (ru ? "Войти" : "Sign in")}</button>
        </form>
        {mode !== "recovery" && <button disabled className="mt-3 w-full rounded-full border border-black/15 py-3.5 font-semibold opacity-40">{ru ? "Вход через Google — скоро" : "Google sign-in — coming soon"}</button>}
        {mode === "signin" && <button onClick={recover} className="mt-4 w-full text-sm underline">{ru ? "Забыли пароль?" : "Forgot password?"}</button>}
        {mode === "recovery" ? <button onClick={()=>router.push("/account")} className="mt-5 w-full text-sm text-black/60 underline">{ru ? "Перейти в личный кабинет" : "Open my account"}</button> : <button onClick={()=>{setMode(mode === "signup" ? "signin" : "signup");setMessage("");setMessageError(false);}} className="mt-5 w-full text-sm text-black/60 underline">{mode === "signup" ? (ru ? "Уже есть аккаунт? Войти" : "Already have an account? Sign in") : (ru ? "Впервые в SHOP.CO? Создать аккаунт" : "New to SHOP.CO? Create account")}</button>}
      </div>
    </main>
  );
}
