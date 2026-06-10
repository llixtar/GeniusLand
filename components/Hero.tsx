"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const directions = [
    "Англійська мова",
    "Підготовка до школи",
    "Арифметика",
    "Логопед",
    "Репетиторство",
  ];

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
    <section id="hero" className="relative overflow-hidden bg-transparent pt-10 pb-20 lg:pt-16 lg:pb-24">
      {/* Декоративні фонові фігури */}
      <div className="absolute top-12 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-bg-sectionAlt/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Ліва частина - займає 7 колонок з 12 */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <h1 className="mt-6 text-4xl font-black tracking-tight text-text-title sm:text-5xl md:text-6xl leading-tight">
              Розкрийте потенціал вашої дитини разом з{" "}
              <span className="relative inline-block text-brand-logoName">
                GeniusLand
              </span>
            </h1>

            <p className="mt-6 text-lg font-medium text-text-body md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Сучасний простір розвитку для дітей від 3 років у Хотині та онлайн.
            </p>

            <ul className="mt-8 space-y-3 inline-block text-left lg:block">
              {directions.map((item, index) => (
                <li 
                  key={index} 
                  className="animate-fade-in-up flex items-center gap-3 text-base font-bold text-text-title sm:text-lg opacity-0"
                  style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="h-2 w-2 rounded-full bg-text-title shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <div className="animate-btn-float w-full sm:w-auto flex justify-center">
                <a
                  href="#register"
                  className="animate-pulse-wave w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-btn-ctaBg hover:bg-btn-ctaBgHover px-8 py-4 text-base font-black text-btn-ctaText shadow-md hover:shadow-lg transition-all group"
                >
                  <span>Записатись на пробне заняття</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              <a
                href="#courses"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white border-2 border-slate-200 hover:border-btn-ctaBg px-8 py-4 text-base font-bold text-text-title hover:text-btn-ctaBg shadow-xs transition-all"
              >
                Переглянути курси
              </a>
            </div>
          </div>

          {/* Права частина: Потужний вертикальний слайдер - займає 5 колонок */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] sm:max-w-[420px] lg:max-w-[450px]">
              
              {/* Декоративна жовта рамка заднього плану */}
              <div className="absolute inset-0 transform rotate-3 rounded-3xl bg-btn-ctaBg/20 shadow-sm" />
              <div className="absolute inset-0 transform -rotate-2 rounded-3xl bg-bg-header/20 backdrop-blur-xs border border-btn-ctaBg/20" />
              
              {/* Контейнер слайдера з пропорцією 3:4 (високий прямокутник) */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-slate-100 aspect-[3/4] shadow-2xl flex flex-col justify-between p-0">
                
                {/* Зображення / Слайд (тепер на всю ширину без відступів) */}
                <div className="relative w-full flex-1 bg-slate-200">
                  
                  {/* Бекграунд-заглушка з градієнтом, якщо картинка вантажиться */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <h4 className="text-xl font-black text-text-title">{slides[currentSlide].title}</h4>
                    <p className="mt-2 text-sm font-medium text-text-muted max-w-xs">{slides[currentSlide].desc}</p>
                  </div>
                  
                  {/* Сама картинка з інсти (закриває весь блок) */}
                  <Image
                    src={slides[currentSlide].img}
                    alt={slides[currentSlide].title}
                    fill
                    priority={currentSlide === 0}
                    className="object-cover opacity-0 transition-opacity duration-300 z-10"
                    onLoadingComplete={(img) => img.classList.remove("opacity-0")}
                  />
                </div>

                {/* Елементи навігації, винесені поверх або зафіксовані внизу */}
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