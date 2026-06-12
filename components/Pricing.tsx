"use client";

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface PricingItem {
  name: string;
  lessons: string;
  price: string;
  duration: string;
  altPack?: {
    lessons: string;
    price: string;
  };
}

const getCourseValue = (name: string, plan: "group" | "individual") => {
  const normName = name.toUpperCase().trim();
  if (normName.includes("РЕПЕТИТОРСТВО")) return plan === "group" ? "tutor_group" : "tutor_indiv";
  if (normName.includes("АНГЛІЙСЬКА")) return plan === "group" ? "english_group" : "english_indiv";
  if (normName.includes("ЛОГОПЕД")) return plan === "group" ? "speech_group" : "speech_indiv";
  if (normName.includes("ТАБЛИЦЯ")) return "multiply_indiv";
  if (normName.includes("МЕНТАЛЬНА")) return plan === "group" ? "mental_group" : "mental_indiv";
  if (normName.includes("ШВИДКОЧИТАННЯ")) return plan === "group" ? "speedread_group" : "speedread_indiv";
  if (normName.includes("ПІДГОТОВКА")) return plan === "group" ? "school_group" : "school_indiv";
  return "";
};

export default function Pricing() {
  const [billingPlan, setBillingPlan] = useState<"group" | "individual">("group");
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const pricingData = {
    group: [
      { name: "РЕПЕТИТОРСТВО", lessons: "8 занять", price: "1620 грн", duration: "55" },
      { name: "АНГЛІЙСЬКА МОВА", lessons: "8 занять", price: "1590 грн", duration: "55" },
      { name: "ЛОГОПЕД", lessons: "8 занять", price: "2000 грн", duration: "30" },
      { name: "МЕНТАЛЬНА АРИФМЕТИКА", lessons: "4 заняття", price: "1190 грн", duration: "55" },
      { name: "ШВИДКОЧИТАННЯ", lessons: "4 заняття", price: "1590 грн", duration: "55" },
      { name: "ПІДГОТОВКА ДО ШКОЛИ", lessons: "8 занять", price: "1620 грн", duration: "55" },
    ],
    individual: [
      { name: "РЕПЕТИТОРСТВО", lessons: "8 занять", price: "2500 грн", duration: "40" },
      { name: "АНГЛІЙСЬКА МОВА", lessons: "8 занять", price: "2800 грн", duration: "40", altPack: { lessons: "12 занять", price: "4200 грн" } },
      { name: "ЛОГОПЕД", lessons: "8 занять", price: "2200 грн", duration: "30" },
      { name: "ТАБЛИЦЯ МНОЖЕННЯ", lessons: "8 занять", price: "2500 грн", duration: "40" },
      { name: "МЕНТАЛЬНА АРИФМЕТИКА", lessons: "4 заняття", price: "1600 грн", duration: "40" },
      { name: "ШВИДКОЧИТАННЯ", lessons: "4 заняття", price: "1500 грн", duration: "40", altPack: { lessons: "8 занять", price: "3000 грн" } },
      { name: "ПІДГОТОВКА ДО ШКОЛИ", lessons: "8 занять", price: "2500 грн", duration: "40" },
    ],
  };

  const currentPlanCards = pricingData[billingPlan];
  const cardsOnSlide = currentPlanCards.slice(activeSlide * 3, activeSlide * 3 + 3).length;

  const handlePlanChange = (plan: "group" | "individual") => {
    setBillingPlan(plan);
    setActiveCardIndex(null);
    setActiveSlide(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0 });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveSlide(newIndex);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      const scrollAmount = direction === "left" ? -width : width;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getContainerHeight = () => {
    if (cardsOnSlide === 1) return "h-[145px]";
    if (cardsOnSlide === 2) return "h-[270px]";
    return "h-[410px]";
  };

  const getArrowTopClass = () => {
    if (cardsOnSlide === 1) return "top-[57px]";
    if (cardsOnSlide === 2) return "top-[123px]";
    return "top-[188px]";
  };

  const renderCard = (item: PricingItem, index: number, isDesktop = false) => {
    const isActive = activeCardIndex === index;
    const clickHandler = (e: React.MouseEvent) => {
      if (!isDesktop) {
        e.stopPropagation();
        setActiveCardIndex(activeCardIndex === index ? null : index);
      }
    };

    return (
      <div
        key={index}
        onClick={clickHandler}
        className={`group relative flex items-center justify-between rounded-3xl border-2 border-black bg-[#2572b4] p-4 text-white min-h-[115px] cursor-pointer transition-all duration-150 ${
          isDesktop
            ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-sm"
            : isActive
              ? "shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-[3px] translate-y-[3px] w-full"
              : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full"
        }`}
      >
        {/* Ліва текстова частина */}
        <div className="flex flex-col justify-center flex-1 pr-2 z-10 select-none">
          <span className="text-[11px] font-black tracking-wider text-[#4a2e1b] uppercase mb-1.5 leading-tight">
            {item.name}
          </span>

          {/* Вартість та заняття */}
          <p className="text-sm font-black tracking-wide text-white whitespace-nowrap">
            {item.lessons} - <span className="font-extrabold text-base">{item.price}</span>
          </p>

          {/* Альтернативний пакет */}
          {"altPack" in item && item.altPack && (
            <p className="text-sm font-black tracking-wide text-white mt-1 border-t border-white/20 pt-1 whitespace-nowrap">
              {item.altPack.lessons} - <span className="font-extrabold text-base">{item.altPack.price}</span>
            </p>
          )}
        </div>

        {/* Права частина: Будильник та Хвилини */}
        <div className="flex items-center gap-2 transition-transform duration-150 z-10 flex-shrink-0 min-w-[95px] justify-end pr-1 group-hover:scale-95">
          {/* Великий білий будильник */}
          <div className="relative w-10 h-10 border-[2.5px] border-white rounded-full flex items-center justify-center flex-shrink-0">
            <div className="absolute top-1 left-[17px] w-[2.5px] h-3.5 bg-white rounded-full" />
            <div className="absolute top-[17px] left-[17px] w-2.5 h-[2.5px] bg-white rounded-full" />
            <div className="absolute -top-1 -left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute -top-1 -right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          {/* Блок хвилин: цифра і слово одного соковитого жовтого кольору */}
          <div className="flex flex-col items-center justify-center leading-none text-center">
            <span className="text-2xl font-black text-[#f7d117] tracking-tighter">
              {item.duration}
            </span>
            <span className="text-[8px] font-black uppercase text-[#f7d117] tracking-wider mt-1">
              хвилин
            </span>
          </div>
        </div>

        {/* Кнопка 3D-натискання */}
        <div className={`absolute bottom-2 right-2 transition-all duration-150 ease-out z-20 ${
          isDesktop
            ? "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
            : isActive
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
        }`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const courseValue = getCourseValue(item.name, billingPlan);
              window.dispatchEvent(new CustomEvent("select-course", { detail: { courseValue } }));
              const contactSection = document.getElementById("contacts");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-black bg-[#f7d117] px-2.5 py-1 text-[9px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all duration-75 whitespace-nowrap cursor-pointer"
          >
            Записатись <ArrowRight className="h-2.5 w-2.5 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="prices" className="relative bg-transparent pt-12 pb-20 border-t-2 border-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Заголовок блоку */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-black tracking-tight text-text-title sm:text-3xl uppercase">
            Вартість заняття
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
        </div>

        {/* Перемикач форматів занять */}
        <div className="flex justify-center mb-10">
          <div className="relative flex p-1 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => handlePlanChange("group")}
              className={`rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${billingPlan === "group"
                ? "bg-btn-ctaBg text-btn-ctaText border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-black border border-transparent hover:text-brand-secondary"
                }`}
            >
              Групові заняття
            </button>
            <button
              onClick={() => handlePlanChange("individual")}
              className={`rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${billingPlan === "individual"
                ? "bg-btn-ctaBg text-btn-ctaText border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-black border border-transparent hover:text-brand-secondary"
                }`}
            >
              Індивідуальні
            </button>
          </div>
        </div>

        {/* МОБІЛЬНИЙ КАРУСЕЛЬ (3 картки в стовпчик на слайд) */}
        <div className="sm:hidden relative w-full overflow-hidden">
          
          {/* Ліва стрілка */}
          {activeSlide > 0 && activeCardIndex === null && (
            <button
              onClick={() => scroll("left")}
              className={`absolute left-1.5 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer -translate-y-1/2 ${getArrowTopClass()}`}
              aria-label="Попередній слайд"
            >
              <ChevronLeft className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          {/* Права стрілка */}
          {activeSlide < Math.ceil(currentPlanCards.length / 3) - 1 && activeCardIndex === null && (
            <button
              onClick={() => scroll("right")}
              className={`absolute right-1.5 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer -translate-y-1/2 ${getArrowTopClass()}`}
              aria-label="Наступний слайд"
            >
              <ChevronRight className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 transition-all duration-300 ${getContainerHeight()}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.from({ length: Math.ceil(currentPlanCards.length / 3) }).map((_, colIndex) => {
              const pair = currentPlanCards.slice(colIndex * 3, colIndex * 3 + 3);
              return (
                <div
                  key={colIndex}
                  className="w-full flex-shrink-0 flex flex-col gap-4 px-12 snap-center"
                >
                  {pair.map((item, idx) => renderCard(item, colIndex * 3 + idx, false))}
                </div>
              );
            })}
          </div>

          {/* Точки пагінації */}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: Math.ceil(currentPlanCards.length / 3) }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2.5 rounded-full border-2 border-black transition-all duration-150 ${activeSlide === idx
                    ? "w-6 bg-btn-ctaBg"
                    : "w-2.5 bg-white"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ДЕСКТОПНА СІТКА */}
        <div className="hidden sm:flex flex-wrap gap-5 justify-center items-stretch w-full max-w-5xl mx-auto">
          {currentPlanCards.map((item, index) => renderCard(item, index, true))}
        </div>

        {/* ПЛАШКА ПРОБНОГО ЗАНЯТТЯ */}
        <div className="mt-12 max-w-2xl mx-auto border-2 border-black bg-btn-ctaBg rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-black text-black uppercase tracking-tight">
                Перше пробне заняття — Безкоштовне
              </h4>
              <p className="text-[11px] font-bold text-black/70 uppercase tracking-tight mt-0.5">
                Визначимо поточний рівень знань дитини абсолютно безкоштовно.
              </p>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              console.log("Запис на пробне заняття");
            }}
            className="w-full sm:w-auto rounded-xl border-2 border-black bg-[#2572b4] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all duration-100 flex-shrink-0 cursor-pointer"
          >
            Спробувати
          </button>
        </div>

      </div>
    </section>
  );
}