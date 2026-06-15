"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Phone, MapPin, Clock, Send, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const courseOptions = [
  { value: "", label: "Ще не визначились" },
  {
    category: "Групові заняття",
    items: [
      { value: "tutor_group", label: "📚 Репетиторство (Група)" },
      { value: "english_group", label: "🇬🇧 Англійська мова (Група)" },
      { value: "speech_group", label: "🗣️ Логопед (Група)" },
      { value: "mental_group", label: "🧮 Ментальна арифметика (Група)" },
      { value: "speedread_group", label: "⚡ Швидкочитання (Група)" },
      { value: "school_group", label: "🎒 Підготовка до школи (Група)" },
    ],
  },
  {
    category: "Індивідуальні заняття",
    items: [
      { value: "tutor_indiv", label: "📚 Репетиторство (Індивідуально)" },
      { value: "english_indiv", label: "🇬🇧 Англійська мова (Індивідуально)" },
      { value: "speech_indiv", label: "🗣️ Логопед (Індивідуально)" },
      { value: "multiply_indiv", label: "✖️ Таблиця множення (Індивідуально)" },
      { value: "mental_indiv", label: "🧮 Ментальна арифметика (Індивідуально)" },
      { value: "speedread_indiv", label: "⚡ Швидкочитання (Індивідуально)" },
      { value: "school_indiv", label: "🎒 Підготовка до школи (Індивідуально)" },
    ],
  },
];

export default function ContactForm() {
  // Стейт для полів форми
  const [formData, setFormData] = useState({ name: "", phone: "", course: "", comment: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSelectedCourseLabel = (value: string) => {
    if (!value) return "Оберіть напрямок...";
    if (value === "") return "Ще не визначились";

    // Пошук у групах
    const groupItems = courseOptions[1].items;
    if (groupItems) {
      const found = groupItems.find(item => item.value === value);
      if (found) return found.label;
    }

    // Пошук в індивідуальних
    const indivItems = courseOptions[2].items;
    if (indivItems) {
      const found = indivItems.find(item => item.value === value);
      if (found) return found.label;
    }

    return "✨ Оберіть напрямок...";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.courseValue) {
        setFormData((prev) => ({ ...prev, course: customEvent.detail.courseValue }));
      }
    };
    window.addEventListener("select-course", handleSelect);
    return () => window.removeEventListener("select-course", handleSelect);
  }, []);

  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          name: formData.name,
          phone: formData.phone,
          course: formData.course || null,
          comment: formData.comment || null,
          status: "new",
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: "", phone: "", course: "", comment: "" });
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setSubmitError("Помилка відправки. Спробуйте ще раз або зв'яжіться з нами по телефону.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contacts" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Головна двоколонкова сітка */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">

          {/* КОЛОНКА 1: КОНТАКТИ */}
          <div className="lg:col-span-5 animate-fade-in-up opacity-0 text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1" style={{ animationFillMode: 'forwards' }}>
            <h2 className="text-2xl font-black text-text-title uppercase tracking-tight sm:text-3xl">
              Зв'яжіться з нами
            </h2>
            <div className="mt-2 h-1 w-12 bg-brand-logoName rounded-full mx-auto lg:mx-0" />
            <p className="mt-4 text-xs font-medium leading-relaxed text-text-muted max-w-md mx-auto lg:mx-0">
              Маєте запитання чи хочете подивитися на нашу школу наживо? Пишіть, телефонуйте або приходьте в гості!
            </p>

            {/* Списочок контактів */}
            <div className="mt-8 space-y-6 text-left w-full max-w-sm sm:max-w-md">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-bg-header">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Наша адреса</h4>
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
            <div className="mt-10 flex flex-col items-center lg:items-start">
              <h4 className="text-xs font-extrabold text-text-title uppercase tracking-wider">Ми в соцмережах</h4>
              <div className="mt-3 flex gap-3.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border-2 border-black text-text-title shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#facc15] active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all duration-75 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border-2 border-black text-text-title shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#229ED9] hover:text-white active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all duration-75 cursor-pointer"
                  aria-label="Telegram"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.703.064-1.237-.465-1.917-.912-1.064-.7-1.665-1.137-2.698-1.817-1.194-.787-.42-1.221.262-1.929.178-.185 3.279-3.007 3.339-3.266.007-.033.014-.154-.059-.219-.073-.065-.18-.043-.258-.025-.111.025-1.88 1.194-5.317 3.518-.503.346-.959.516-1.368.506-.451-.01-1.318-.255-1.963-.465-.79-.258-1.418-.397-1.363-.838.028-.23.346-.465.952-.707 3.725-1.622 6.208-2.693 7.449-3.213 3.541-1.488 4.276-1.747 4.757-1.755.106-.002.346.024.5.15.13.104.166.248.176.353-.008.204-.002.413-.01.627z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* КОЛОНКА 2: ФОРМА ЗАПИСУ */}
          <div className="lg:col-span-7 animate-fade-in-up opacity-0 order-1 lg:order-2" style={{ animationDelay: "150ms", animationFillMode: 'forwards' }}>
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
                      placeholder="+380 (__) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-text-title placeholder-slate-400 focus:border-bg-header focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-[11px] font-extrabold text-text-title uppercase tracking-wider mb-1.5">
                      Оберіть напрямок
                    </label>

                    {/* Кнопка-селектор у 3D-стилі */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full flex items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-text-title transition-all duration-75 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] ${isDropdownOpen ? "border-brand-primary shadow-none translate-x-[3px] translate-y-[3px]" : ""
                        }`}
                    >
                      <span className="truncate">{getSelectedCourseLabel(formData.course)}</span>
                      <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? "rotate-180 text-brand-primary" : "text-black"
                        }`} />
                    </button>

                    {/* Спливаюче меню */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in-up">

                        {/* Опція: Ще не визначились */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, course: "" });
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full rounded-xl px-3 py-2.5 text-left text-xs uppercase tracking-wider transition-colors hover:bg-black/5 hover:text-brand-secondary ${
                            formData.course === ""
                              ? "font-black text-black"
                              : "font-semibold text-text-body"
                          }`}
                        >
                          Ще не визначились
                        </button>

                        {/* Категорії */}
                        {[courseOptions[1], courseOptions[2]].map((group) => (
                          <div key={group.category} className="mt-2.5">
                            {/* Заголовок категорії */}
                            <div className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-text-muted bg-slate-100 rounded-lg mb-1 select-none">
                              {group.category}
                            </div>

                            {/* Елементи категорії */}
                            <div className="space-y-0.5">
                              {group.items?.map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, course: item.value });
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-75 flex items-center gap-2 hover:bg-btn-ctaBg hover:text-black hover:translate-x-1 ${
                                    formData.course === item.value
                                      ? "font-black text-black"
                                      : "font-semibold text-text-body"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-text-title uppercase tracking-wider mb-1.5">
                      Ваш коментар (необов'язково)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Наприклад: краще займатись у першій половині дня..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-text-title placeholder-slate-400 focus:border-bg-header focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-xl border-2 border-black bg-rose-50 p-3 text-xs font-bold text-rose-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
                      {submitError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSending}
                      className={`w-full rounded-xl bg-btn-ctaBg py-3.5 text-xs font-black uppercase tracking-wider text-btn-ctaText border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.98] transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer ${
                        isSending ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <span>{isSending ? "Надсилання..." : "Надіслати заявку"}</span>
                      <Send className={`h-3.5 w-3.5 stroke-[2.5] ${isSending ? "animate-pulse" : ""}`} />
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