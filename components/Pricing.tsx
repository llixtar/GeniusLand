"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Pricing() {
  const [billingPlan, setBillingPlan] = useState<"group" | "individual">("group");

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
              onClick={() => setBillingPlan("group")}
              className={`rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${billingPlan === "group"
                ? "bg-btn-ctaBg text-btn-ctaText border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-black border border-transparent hover:text-brand-secondary"
                }`}
            >
              Групові заняття
            </button>
            <button
              onClick={() => setBillingPlan("individual")}
              className={`rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${billingPlan === "individual"
                ? "bg-btn-ctaBg text-btn-ctaText border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-black border border-transparent hover:text-brand-secondary"
                }`}
            >
              Індивідуальні
            </button>
          </div>
        </div>

        {/* СІТКА ПЛАШОК */}
        <div className="flex flex-wrap gap-5 justify-center items-stretch w-full max-w-5xl mx-auto">
          {pricingData[billingPlan].map((item, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-between rounded-3xl border-2 border-black bg-[#2572b4] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 cursor-pointer min-h-[115px] w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-sm"
            >
              {/* Ліва текстова частина */}
              <div className="flex flex-col justify-center flex-1 pr-2 z-10">
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

              {/* ВИПРАВЛЕНО: Кнопка отримала інтерактивний ефект 3D-натискання (hover:translate-x і hover:shadow-none) */}
              <div className="absolute bottom-2 right-2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-out z-20">
                <span className="inline-flex items-center gap-1 rounded-xl border border-black bg-[#f7d117] px-2.5 py-1 text-[9px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-75 whitespace-nowrap">
                  Записатись <ArrowRight className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* ПЛАШКА ПРОБНОГО ЗАНЯТТЯ З КРУТИМ 3D-ХОВЕРОМ */}
        <div className="mt-12 max-w-2xl mx-auto border-2 border-black bg-btn-ctaBg rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 cursor-pointer">
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

          {/* КНОПКА: Колір як у плашок (#2572b4), реагує натисканням ТІЛЬКИ при наведенні суто на неї */}
          <button className="w-full sm:w-auto rounded-xl border-2 border-black bg-[#2572b4] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-100 flex-shrink-0">
            Спробувати
          </button>
        </div>

      </div>
    </section>
  );
}