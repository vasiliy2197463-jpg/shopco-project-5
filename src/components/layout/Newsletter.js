'use client';

import { useState } from 'react';
import { IoMailOutline } from 'react-icons/io5';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [statusError, setStatusError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { language } = useLanguage();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatusError(true);
      setStatus(language === 'ru' ? 'Сервис подписки временно недоступен.' : 'Subscription service is temporarily unavailable.');
      return;
    }
    setSubmitting(true);
    setStatus('');
    setStatusError(false);
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalizedEmail, language });
    if (!error) {
      setEmail('');
      setStatus(language === 'ru' ? 'Готово! Вы подписались на новости.' : 'Done! You are subscribed to our newsletter.');
    } else if (error.code === '23505') {
      setStatusError(false);
      setStatus(language === 'ru' ? 'Этот адрес уже подписан на новости.' : 'This email is already subscribed.');
    } else {
      setStatusError(true);
      setStatus(language === 'ru' ? 'Не удалось оформить подписку. Попробуйте ещё раз.' : 'Could not subscribe. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="relative z-10 mt-[30px] mb-[10px] w-full px-4 md:px-6">
      <div className="max-w-[1240px] mx-auto bg-black rounded-[20px] px-6 py-8 md:px-16 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-lg">
        <h2 className="font-integral text-[24px] sm:text-[32px] md:text-[40px] font-bold text-white leading-tight md:max-w-[550px]">
          {language === 'ru' ? 'БУДЬТЕ В КУРСЕ НАШИХ ЛУЧШИХ ПРЕДЛОЖЕНИЙ' : 'STAY UPTO DATE ABOUT OUR LATEST OFFERS'}
        </h2>
        
        <form onSubmit={handleSubscribe} className="flex flex-col space-y-3 w-full md:max-w-[350px]">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <IoMailOutline size={24} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'ru' ? 'Введите электронную почту' : 'Enter your email address'}
              className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm font-satoshi focus:outline-none text-black"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-satoshi font-medium rounded-full py-3 hover:bg-gray-100 transition-colors disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? (language === 'ru' ? 'Подписываем…' : 'Subscribing…') : (language === 'ru' ? 'Подписаться на новости' : 'Subscribe to Newsletter')}
          </button>
          {status && <p className={`rounded-xl px-4 py-2 text-sm ${statusError ? 'bg-red-500/25 text-red-100 ring-1 ring-red-400/50' : 'bg-white/10 text-white'}`} role="status">{status}</p>}
        </form>
      </div>
    </div>
  );
}
