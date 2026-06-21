"use client";

import { useState, useEffect } from "react";
import { Laptop, MapPin, Tag, ShieldCheck, ChevronLeft, ChevronRight, Clock, Sparkles, X } from "lucide-react";


export default function Hero() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const promotions = [
    {
      id: 1,
      badge: "АКЦІЯ",
      title: "Приведи друга",
      desc: "Приведи друга і отримайте знижку -10% на курс! Посилання нижче веде до вибору курсу.",
      discount: "-10%",
      expiry: "До 30 червня",
      color: "bg-btn-ctaBg",
      textColor: "text-btn-ctaText",
      link: "#prices?promo=friend",
      btnText: "Обрати курс"
    },
    {
      id: 2,
      badge: "РОЗІГРАШ",
      title: "Тегни друга в коментарях",
      desc: [
        "Для участі:",
        "1. Підпишіться на нашу сторінку.",
        "2. Лайкніть пост.",
        "3. Тегніть друга в коментарях під постом."
      ],
      discount: "GIFT",
      expiry: "2026-06-28T15:00:00",
      color: "bg-[#e11d48]",
      textColor: "text-white",
      link: "https://www.instagram.com/geniusland.school",
      btnText: "Брати участь"
    },
    {
      id: 3,
      badge: "НОВИНКА",
      title: "Перший урок",
      desc: "Спробуйте перше повноцінне заняття для нових учнів абсолютно безкоштовно.",
      discount: "FREE",
      expiry: "Постійно",
      color: "bg-brand-secondary",
      textColor: "text-white",
      link: "#contacts",
      btnText: "Записатись"
    }
  ];

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.includes("promo=friend")) {
      e.preventDefault();
      window.history.pushState(null, "", "?promo=friend#prices");
      window.dispatchEvent(new CustomEvent("activate-friend-promo"));
      const target = document.getElementById("prices");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Touch handlers for swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextPromo();
    } else if (distance < -minSwipeDistance) {
      prevPromo();
    }
  };

  // Collapse on scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsMobileExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer for giveaways or time-limited promotions
  useEffect(() => {
    const targetDateStr = promotions[currentPromo]?.expiry;
    if (!targetDateStr || !targetDateStr.includes("T")) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPromo]);

  // Автоматичне перемикання акцій з паузою на ховер / розгорнутий стан на мобілці
  useEffect(() => {
    if (promotions.length <= 1) return;
    const shouldPause = isPaused || isMobileExpanded;
    if (shouldPause) return;

    const timer = setInterval(() => {
      nextPromo();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isMobileExpanded, promotions.length]);

  return (
    <section id="hero" className="relative overflow-hidden bg-transparent pt-28 pb-20 lg:pt-36 lg:pb-24 z-0">
      {/* Декоративні фонові фігури */}
      <div className="absolute top-12 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-bg-sectionAlt/60 blur-3xl" />
      

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* ========================================================= */}
          {/* ЛІВА ЧАСТИНА: Маркетинг + Оновлений заголовок + 3D Стиль */}
          {/* ========================================================= */}
          <div className="text-center lg:col-span-7 lg:text-left flex flex-col justify-center">

            {/* Мобільна версія акційної картки над заголовком (замість статичного стікера) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => {
                // Ignore toggling when clicking links or buttons
                if ((e.target as HTMLElement).closest("a, button")) return;
                setIsMobileExpanded(!isMobileExpanded);
              }}
              className={`lg:hidden relative w-full max-w-sm bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 mb-6 overflow-visible text-left mx-auto transition-all duration-300 cursor-pointer select-none ${
                isMobileExpanded ? "min-h-[110px]" : "min-h-[55px]"
              }`}
            >
              {/* Міні-стікер знижки в кутку */}
              <div className="absolute -top-3 -right-3 z-20 transition-transform duration-300 hover:scale-110">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-12 ${promotions[currentPromo].color}`}>
                  <span className={`text-[11px] font-black font-heading tracking-tighter ${promotions[currentPromo].textColor}`}>
                    {promotions[currentPromo].discount}
                  </span>
                </div>
              </div>

              {/* Вміст */}
              <div key={currentPromo} className="relative z-10 animate-promo-switch pr-[44px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border border-black ${promotions[currentPromo].color} ${promotions[currentPromo].textColor}`}>
                    {promotions[currentPromo].badge}
                  </span>
                  {timeLeft ? (
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      до кінця: {timeLeft.days}д {timeLeft.hours}г {timeLeft.minutes}хв
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-text-muted">
                      {promotions[currentPromo].expiry}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-heading font-black text-text-title leading-tight">
                  {promotions[currentPromo].title}
                </h4>

                {/* Анімований блок розгортання */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileExpanded ? "max-h-48 opacity-100 mt-1.5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                  {Array.isArray(promotions[currentPromo].desc) ? (
                    <div className="text-[11px] font-subheading font-medium text-text-muted leading-relaxed space-y-0.5 mb-2">
                      {(promotions[currentPromo].desc as string[]).map((line, idx) => (
                        <p key={idx} className={idx === 0 ? "font-bold text-text-title" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-subheading font-medium text-text-muted leading-relaxed mb-2">
                      {promotions[currentPromo].desc as string}
                    </p>
                  )}

                  {/* Навігація та дія */}
                  <div className="flex items-center justify-between">
                    <a
                      href={promotions[currentPromo].link}
                      onClick={(e) => handleCtaClick(e, promotions[currentPromo].link)}
                      target={promotions[currentPromo].link.startsWith("http") ? "_blank" : undefined}
                      rel={promotions[currentPromo].link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-xs font-button font-black text-brand-secondary hover:underline flex items-center gap-0.5"
                    >
                      {promotions[currentPromo].btnText} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ГОЛОВНИЙ ЗАГОЛОВОК: Окреме керування розмірами тексту */}
            <h1 className="font-black tracking-tight leading-tight uppercase">
              {/* Назва бренду */}
              <span className="text-bg-header text-4xl sm:text-5xl md:text-6xl block font-brand">
                GeniusLand
              </span>
              {/* Решта тексту заголовка */}
              <span className="text-text-title text-lg sm:text-3xl md:text-3xl block mt-2 lg:mt-3 font-heading">
                Сучасна онлайн-освіта
              </span>
              <span className="text-text-title text-lg sm:text-3xl md:text-3xl block font-heading">
                для майбутніх геніїв
              </span>
            </h1>

            {/* ПІДЗАГОЛОВОК */}
            <p className="mt-6 text-base font-medium text-text-muted md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-subheading">
              Розвиваємо логіку, увагу та критичне мислення дитини через захопливі інтерактивні заняття на нашій платформі.
              Живете в Хотині? Приходьте до нас на живі офлайн-уроки!
            </p>

            {/* КНОПКИ ДІЇ: Повний 3D бруталізм з ефектом вдавлювання при кліку */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#contacts"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-btn-ctaBg px-8 py-4 text-base font-button font-black text-btn-ctaText border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.97] transition-all duration-75 text-center cursor-pointer uppercase tracking-wider"
              >
                Записатись на урок
              </a>
              <a
                href="#courses"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-secondary px-8 py-4 text-base font-button font-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.97] transition-all duration-75 text-center cursor-pointer uppercase tracking-wider"
              >
                Переглянути курси
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ПРАВА ЧАСТИНА: Динамічна картка пропозицій (Десктоп)        */}
          {/* ========================================================= */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="hidden lg:flex lg:col-span-5 w-full justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[400px] sm:max-w-[420px] lg:max-w-[450px]">
              {/* Декоративні рамки заднього плану */}
              <div className="absolute inset-0 transform rotate-3 rounded-3xl bg-btn-ctaBg/20 shadow-sm" />
              <div className="absolute inset-0 transform -rotate-2 rounded-3xl bg-bg-header/20 backdrop-blur-xs border border-btn-ctaBg/20" />

              {/* Головна картка */}
              <div key={currentPromo} className="relative bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col overflow-visible animate-promo-switch">
                
                {/* Великий 3D Стікер Знижки (Абсолютне позиціонування, виступає за межі картки) */}
                <div className="absolute -top-6 -right-6 z-20">
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 ${promotions[currentPromo].color}`}>
                    <span className={`text-2xl sm:text-3xl font-black font-heading tracking-tighter ${promotions[currentPromo].textColor}`}>
                      {promotions[currentPromo].discount}
                    </span>
                  </div>
                </div>

                {/* Декоративний елемент на фоні */}
                <Sparkles className="absolute -bottom-10 -left-10 w-40 h-40 text-black/5" />

                <div className="relative z-10 pr-[72px] sm:pr-[88px]">
                  {/* Бейдж та Таймер */}
                  <div className="flex flex-wrap gap-2 items-center mb-4">
                    <div className={`inline-flex px-3 py-1.5 rounded-full border-2 border-black font-black text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${promotions[currentPromo].color} ${promotions[currentPromo].textColor}`}>
                      {promotions[currentPromo].badge}
                    </div>
                    {timeLeft ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shadow-[1px_1px_0px_0px_rgba(225,29,72,0.2)]">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>
                          до кінця: {timeLeft.days}д {timeLeft.hours}г {timeLeft.minutes}хв {timeLeft.seconds}с
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted bg-slate-100 px-3 py-1.5 rounded-full border border-black/10">
                        <Clock className="w-3.5 h-3.5" />
                        {promotions[currentPromo].expiry}
                      </div>
                    )}
                  </div>

                  {/* Заголовок та Опис */}
                  <h3 className={`font-heading font-black text-text-title leading-tight mb-3 transition-all ${
                    promotions[currentPromo].title.length > 20 
                      ? "text-xl sm:text-2xl" 
                      : "text-2xl sm:text-3xl"
                  }`}>
                    {promotions[currentPromo].title}
                  </h3>
                  {Array.isArray(promotions[currentPromo].desc) ? (
                    <div className="text-sm font-subheading font-medium text-text-muted leading-relaxed space-y-1 mt-1">
                      {(promotions[currentPromo].desc as string[]).map((line, idx) => (
                        <p key={idx} className={idx === 0 ? "font-bold text-text-title mb-1.5" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-subheading font-medium text-text-muted leading-relaxed">
                      {promotions[currentPromo].desc as string}
                    </p>
                  )}
                </div>

                {/* Навігація та Кнопка */}
                <div className="relative z-10 flex items-center justify-between mt-8">
                  {/* Кнопки перемикання (якщо акцій > 1) */}
                  {promotions.length > 1 && (
                    <div className="flex gap-2">
                      <button onClick={prevPromo} className="p-2 rounded-xl border-2 border-black bg-white hover:bg-slate-100 active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={nextPromo} className="p-2 rounded-xl border-2 border-black bg-white hover:bg-slate-100 active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Кнопка дії */}
                  <a
                    href={promotions[currentPromo].link}
                    onClick={(e) => handleCtaClick(e, promotions[currentPromo].link)}
                    target={promotions[currentPromo].link.startsWith("http") ? "_blank" : undefined}
                    rel={promotions[currentPromo].link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`flex-1 ml-4 text-center py-3 rounded-xl border-2 border-black font-button font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all ${promotions[currentPromo].color} ${promotions[currentPromo].textColor}`}
                  >
                    {promotions[currentPromo].btnText}
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* ПЕРЕВАГИ БАТЬКІВ (Замість довгого списку предметів) */}
          <div className="lg:col-span-12 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-black/5 pt-8 text-center sm:text-left">
            <div className="p-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Laptop className="h-4 w-4 text-bg-header" />
                <h4 className="text-xs font-black text-text-title uppercase tracking-tight">Зручний онлайн</h4>
              </div>
              <p className="text-[11px] font-medium text-text-muted leading-snug">Уроки з будь-якої точки світу в комфортному для дитини темпі.</p>
            </div>

            <div className="p-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <MapPin className="h-4 w-4 text-brand-secondary" />
                <h4 className="text-xs font-black text-text-title uppercase tracking-tight">Офлайн у Хотині</h4>
              </div>
              <p className="text-[11px] font-medium text-text-muted leading-snug">Затишні та безпечні класи для занять наживо у нашому центрі.</p>
            </div>

            <div className="p-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-brand-logoName stroke-[2.5]" />
                <h4 className="text-xs font-black text-text-title uppercase tracking-tight">Без ризиків</h4>
              </div>
              <p className="text-[11px] font-medium text-text-muted leading-snug">Спробуйте перший повноцінний ігровий урок повністю безкоштовно.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}