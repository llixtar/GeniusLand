"use client";

import { useState, FormEvent } from "react";
import { Phone, MapPin, Clock, Send, Camera, MessageSquare } from "lucide-react";

export default function ContactForm() {
  // Стейт для полів форми
  const [formData, setFormData] = useState({ name: "", phone: "", course: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Дані форми:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", phone: "", course: "" });
  };

  return (
    <section id="contacts" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Головна двоколонкова сітка */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          {/* КОЛОНКА 1: КОНТАКТИ */}
          <div className="lg:col-span-5 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h2 className="text-2xl font-black text-text-title uppercase tracking-tight sm:text-3xl">
              Зв'яжіться з нами
            </h2>
            <div className="mt-2 h-1 w-12 bg-brand-logoName rounded-full" />
            <p className="mt-4 text-xs font-medium leading-relaxed text-text-muted">
              Маєте запитання чи хочете подивитися на нашу школу наживо? Пишіть, телефонуйте або приходьте в гості!
            </p>

            {/* Списочок контактів */}
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-bg-header">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Наша адреса</h4>
                  {/* ОНОВЛЕНО НА ХОТИН, УКРАЇНА */}
                  <p className="mt-0.5 text-xs font-semibold text-text-muted">м. Хотин, Чернівецька область, Україна</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-bg-header">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Телефон</h4>
                  <p className="mt-0.5 text-xs font-semibold text-text-muted hover:text-bg-header transition-colors">
                    {/* УКРАЇНСЬКИЙ ТЕЛЕФОН */}
                    <a href="tel:+380500000000">+380 (50) 000-00-00</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-bg-header">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Графік роботи</h4>
                  <p className="mt-0.5 text-xs font-semibold text-text-muted">Пн-Пт: 09:00 - 19:00 | Сб: 10:00 - 15:00</p>
                </div>
              </div>
            </div>

            {/* Соцмережі */}
            <div className="mt-10">
              <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Ми в соцмережах</h4>
              <div className="mt-3 flex gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-text-title hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all">
                  <Camera className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-text-title hover:bg-bg-header hover:text-white hover:border-bg-header transition-all">
                  <MessageSquare className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* КОЛОНКА 2: ФОРМА ЗАПИСУ */}
          <div className="lg:col-span-7 animate-fade-in-up opacity-0" style={{ animationDelay: "150ms", animationFillMode: 'forwards' }}>
            <div className="rounded-3xl border border-slate-300/60 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-black text-text-title uppercase tracking-tight">
                Записати дитину на заняття
              </h3>
              <p className="mt-1 text-xs font-medium text-text-muted">
                Залиште контакти, і наш адміністратор зв'яжеться з вами для підтвердження дати пробного уроку.
              </p>

              {isSubmitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <h4 className="text-sm font-bold text-emerald-800">Дякуємо, заявку прийнято!</h4>
                  <p className="mt-2 text-xs text-emerald-600 font-medium">Ми зателефонуємо вам найближчим часом.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    Відправити ще одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-text-title uppercase tracking-wider mb-1.5">
                      Ваше ім'я
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Наприклад, Тетяна"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-text-title placeholder-slate-400 focus:border-bg-header focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-text-title uppercase tracking-wider mb-1.5">
                      Номер телефону
                    </label>
                    <input
                      type="tel"
                      required
                      /* ОНОВЛЕНО ПЛЕЙСХОЛДЕР НА УКРАЇНСЬКИЙ */
                      placeholder="+380 (__) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-text-title placeholder-slate-400 focus:border-bg-header focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-text-title uppercase tracking-wider mb-1.5">
                      Оберіть напрямок
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-text-title focus:border-bg-header focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Ще не визначились</option>
                      <option value="school">Підготовка до школи</option>
                      <option value="english">Англійська мова</option>
                      <option value="logic">Арифметика & Логіка</option>
                      <option value="speech">Заняття з логопедом</option>
                      <option value="tutor">Репетиторство</option>
                      <option value="online">Online консультація</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-btn-ctaBg py-3.5 text-xs font-bold uppercase tracking-wider text-btn-ctaText hover:bg-btn-ctaBgHover shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Надіслати заявку</span>
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}