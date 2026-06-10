"use client";

import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Пробний старт",
      price: 0,
      period: "1 заняття",
      desc: "Знайомство з викладачем, атмосферою школи та визначення рівня дитини.",
      features: [
        "Тестування навичок дитини",
        "Участь в ігровому уроці",
        "Консультація методиста",
        "Батьківський звіт",
      ],
      cta: "Записатись безкоштовно",
      hit: false,
    },
    {
      name: "Базовий абонемент",
      price: 1200,
      period: "місяць",
      desc: "Оптимальний варіант для регулярних занять та стабільного прогресу.",
      features: [
        "8 занять на місяць (2 на тиждень)",
        "Усі навчальні матеріали",
        "Зворотний зв'язок після уроків",
        "Можливість відпрацювання",
      ],
      cta: "Придбати абонемент",
      hit: true, // Ця картка залишається візуально виділеною
    },
    {
      name: "Індівидуальний",
      price: 2400,
      period: "місяць",
      desc: "Персональна програма навчання, підлаштована під темп та цілі вашої дитини.",
      features: [
        "8 індивідуальних занять",
        "Гнучкий графік уроків",
        "Персональний викладач",
        "Корекція програми на ходу",
      ],
      cta: "Обрати індивідуальний",
      hit: false,
    },
  ];

  return (
    <section id="pricing" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-black tracking-tight text-text-title sm:text-3xl uppercase">
            Вартість навчання
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
          <p className="mt-3 text-sm font-medium text-text-muted">
            Прозорі тарифи без прихованих платежів. Оберіть зручний формат
          </p>
        </div>

        {/* СІТКА ТАРИФІВ (ЧИСТА ГЕОМЕТРІЯ БЕЗ ТУМБЛЕРА) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-fade-in-up relative flex flex-col justify-between rounded-3xl bg-white p-6 transition-all duration-300 overflow-hidden border opacity-0 ${
                plan.hit
                  ? "border-text-title lg:py-8 shadow-xs ring-1 ring-text-title"
                  : "border-slate-300/60 hover:border-text-title"
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              {/* Хіт-бейдж */}
              {plan.hit && (
                <span className="absolute top-3 right-3 rounded-full bg-btn-ctaBg px-2.5 py-0.5 text-[10px] font-black text-btn-ctaText uppercase tracking-wider">
                  Хіт продажів
                </span>
              )}

              <div>
                {/* Назва плану */}
                <h3 className="text-lg font-black text-text-title uppercase tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-text-muted min-h-[40px]">
                  {plan.desc}
                </p>

                {/* Статична фіксована ціна */}
                <div className="mt-6 flex items-baseline text-text-title">
                  <span className="text-4xl font-black tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-lg font-bold ml-1">грн</span>
                  <span className="text-xs font-bold text-text-muted ml-2">
                    / {plan.period}
                  </span>
                </div>

                <div className="mt-3 h-px bg-slate-100" />

                {/* Перелік переваг */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-xs font-medium text-text-muted">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-text-title">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Кнопка CTA */}
              <div className="mt-8">
                <button
                  className={`w-full rounded-2xl py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    plan.hit
                      ? "bg-text-title text-white hover:bg-brand-logoName"
                      : "bg-slate-50 border border-slate-200 text-text-title hover:bg-text-title hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}