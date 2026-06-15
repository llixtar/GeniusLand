"use client";

import { useState } from "react";
import Image from "next/image";
import { Laptop, MapPin, Tag, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, title: "Ласкаво просимо до GeniusLand", desc: "Простір, де навчання стає захопливою пригодою.", img: "/hero-slider/cover.jpg" },
    { id: 2, title: "Індивідуальний підхід", desc: "Маленькі групи до 6 дітей.", img: "/hero-slider/reason-1.jpg" },
    { id: 3, title: "Сучасні методики", desc: "Навчання через гру та цікаві квести.", img: "/hero-slider/reason-2.jpg" },
    { id: 4, title: "Безпечний простір", desc: "Офлайн-класи з укриттям та всім необхідним.", img: "/hero-slider/reason-3.jpg" },
    { id: 5, title: "Досвідчені педагоги", desc: "Педагоги, які люблять свою справу.", img: "/hero-slider/reason-4.jpg" },
    { id: 6, title: "Гнучкий формат", desc: "Поєднуйте офлайн у Хотині та онлайн.", img: "/hero-slider/reason-5.jpg" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-transparent pt-28 pb-20 lg:pt-36 lg:pb-24">
      {/* Декоративні фонові фігури */}
      <div className="absolute top-12 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-bg-sectionAlt/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* ========================================================= */}
          {/* ЛІВА ЧАСТИНА: Маркетинг + Оновлений заголовок + 3D Стиль */}
          {/* ========================================================= */}
          <div className="text-center lg:col-span-7 lg:text-left flex flex-col justify-center">

            {/* ГАЧОК: Статичний стікер у кольорі фону сайту з чіткою чорною 3D-тінню */}
            <div className="inline-flex items-center gap-2 bg-bg-main text-black text-[12px] font-black px-4 py-2 rounded-xl uppercase tracking-wider mx-auto lg:mx-0 w-fit mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Tag className="h-4 w-4 -rotate-90 stroke-[3] text-bg-header" />
              <span>Перше пробне заняття — безкоштовно</span>
            </div>

            {/* ГОЛОВНИЙ ЗАГОЛОВОК: Окреме керування розмірами тексту */}
            <h1 className="font-black tracking-tight leading-tight uppercase">
              {/* Назва бренду */}
              <span className="text-bg-header text-4xl sm:text-5xl md:text-6xl block">
                GeniusLand
              </span>
              {/* Решта тексту заголовка */}
              <span className="text-text-title text-lg sm:text-3xl md:text-3xl block mt-2 lg:mt-3">
                Сучасна онлайн-освіта
              </span>
              <span className="text-text-title text-lg sm:text-3xl md:text-3xl block">
                для майбутніх геніїв
              </span>
            </h1>

            {/* ПІДЗАГОЛОВОК */}
            <p className="mt-6 text-base font-medium text-text-muted md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Розвиваємо логіку, увагу та критичне мислення дитини через захопливі інтерактивні заняття на нашій платформі.
              Живете в Хотині? Приходьте до нас на живі офлайн-уроки!
            </p>

            {/* КНОПКИ ДІЇ: Повний 3D бруталізм з ефектом вдавлювання при кліку */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6">

              {/* Перша кнопка (Жовта) */}
              <div className="animate-btn-float w-full sm:w-auto flex justify-center">
                <a
                  href="#contacts"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-btn-ctaBg px-8 py-4 text-base font-black text-btn-ctaText border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.97] transition-all duration-75 text-center cursor-pointer uppercase tracking-wider"
                >
                  Записатись на безкоштовний урок
                </a>
              </div>

              {/* Друга кнопка (Рожева) */}
              <div className="animate-btn-float w-full sm:w-auto flex justify-center">
                <a
                  href="#courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-secondary px-8 py-4 text-base font-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.97] transition-all duration-75 text-center cursor-pointer uppercase tracking-wider"
                >
                  Переглянути курси
                </a>
              </div>

            </div>

            {/* ПЕРЕВАГИ БАТЬКІВ (Замість довгого списку предметів) */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-black/5 pt-8 text-center sm:text-left">
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

          {/* ========================================================= */}
          {/* ПРАВА ЧАСТИНА: Слайдер у первісному вигляді (5 колонок)     */}
          {/* ========================================================= */}
          <div className="hidden lg:flex lg:col-span-5 w-full justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] sm:max-w-[420px] lg:max-w-[450px]">

              {/* Декоративні рамки заднього плану під слайдером */}
              <div className="absolute inset-0 transform rotate-3 rounded-3xl bg-btn-ctaBg/20 shadow-sm" />
              <div className="absolute inset-0 transform -rotate-2 rounded-3xl bg-bg-header/20 backdrop-blur-xs border border-btn-ctaBg/20" />

              {/* Контейнер слайдера з пропорцією 3:4 */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-slate-100 aspect-[3/4] shadow-2xl flex flex-col justify-between p-0">

                {/* Зображення / Слайд */}
                <div className="relative w-full flex-1 bg-slate-200">

                  {/* Бекграунд-заглушка з градієнтом */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <h4 className="text-xl font-black text-text-title">{slides[currentSlide].title}</h4>
                    <p className="mt-2 text-sm font-medium text-text-muted max-w-xs">{slides[currentSlide].desc}</p>
                  </div>

                  <Image
                    src={slides[currentSlide].img}
                    alt={slides[currentSlide].title}
                    fill
                    priority={currentSlide === 0}
                    className="object-cover opacity-0 transition-opacity duration-300 z-10"
                    onLoadingComplete={(img) => img.classList.remove("opacity-0")}
                  />
                </div>

                {/* Навігація слайдера */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-12 pb-4 px-4 flex items-center justify-between z-20">

                  {/* Кнопка назад */}
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/90 text-text-title shadow-md hover:bg-btn-ctaBg hover:text-btn-ctaText transition-colors backdrop-blur-xs"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Крапочки-індикатори */}
                  <div className="flex gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                    {slides.map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-5 bg-btn-ctaBg' : 'w-2 bg-white/60'}`}
                      />
                    ))}
                  </div>

                  {/* Кнопка вперед */}
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/90 text-text-title shadow-md hover:bg-btn-ctaBg hover:text-btn-ctaText transition-colors backdrop-blur-xs"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}