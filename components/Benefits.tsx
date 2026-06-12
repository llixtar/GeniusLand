"use client";

import { useState, useRef } from "react";
import { 
  TrendingUp, 
  Brain, 
  Smile, 
  Target, 
  BookOpen, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Benefits() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const benefitsData = [
    {
      title: "Інтелектуальний розвиток",
      description: "Значне покращення пам'яті, концентрації уваги та швидкості мислення завдяки перевіреним методикам ментальної арифметики.",
      icon: Brain,
    },
    {
      title: "Мовна впевненість",
      description: "Подолання мовного бар'єру, вільне спілкування англійською мовою та розширення словникового запасу без страху зробити помилку.",
      icon: TrendingUp,
    },
    {
      title: "Правильне та чітке мовлення",
      description: "Формування правильної вимови звуків, розвиток зв'язного мовлення та впевненості у власному голосі завдяки роботі з логопедом.",
      icon: ShieldCheck,
    },
    {
      title: "Легка адаптація до школи",
      description: "Повна готовність до шкільних навантажень (читання, рахунок, логіка) та формування позитивного ставлення до самого процесу навчання.",
      icon: BookOpen,
    },
    {
      title: "Самостійність та дисципліна",
      description: "Дитина вчиться ставити цілі, фокусуватися на завданнях та самостійно виконувати вправи з щирим інтересом та задоволенням.",
      icon: Target,
    },
    {
      title: "Навчання без стресу",
      description: "Формування стійкої впевненості у своїх силах. Дитина починає сприймати освіту як захоплюючу гру, а не як важкий обов'язок.",
      icon: Smile,
    },
  ];

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

  const renderCard = (benefit: typeof benefitsData[0], index: number) => {
    const IconComponent = benefit.icon;
    return (
      <div
        key={index}
        className="group relative flex flex-col justify-between rounded-3xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 ease-in-out w-full"
      >
        <div>
          {/* Контрастна іконка у 3D стилі */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-btn-ctaBg text-btn-ctaText shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none">
            <IconComponent className="h-6 w-6 stroke-[2]" />
          </div>

          {/* Текст переваги */}
          <h3 className="text-base font-black tracking-tight text-text-title mt-5 uppercase">
            {benefit.title}
          </h3>
          <p className="text-xs font-bold text-text-body leading-relaxed mt-2.5">
            {benefit.description}
          </p>
        </div>

        {/* Декоративний бруталістичний елемент внизу */}
        <div className="mt-5 pt-2 flex justify-end">
          <div className="h-2 w-8 rounded-full border border-black bg-brand-secondary transition-all duration-150 group-hover:w-16 group-hover:bg-btn-ctaBg" />
        </div>
      </div>
    );
  };

  return (
    <section id="benefits" className="relative bg-transparent pt-16 pb-20 border-t-2 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Бруталістичний заголовок */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight text-text-title sm:text-4xl uppercase">
            Результат, який отримає ваша дитина
          </h2>
          <p className="text-xs font-black text-text-muted uppercase tracking-widest mt-2.5">
            Якісні зміни, що залишаться з дитиною на все життя
          </p>
          <div className="mt-3 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
        </div>

        {/* МОБІЛЬНИЙ КАРУСЕЛЬ (по 1 картці на слайд для ідеальної висоти) */}
        <div className="sm:hidden relative w-full overflow-hidden">
          
          {/* Ліва стрілка */}
          {activeSlide > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-1.5 top-[50%] -translate-y-1/2 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer"
              aria-label="Попередній слайд"
            >
              <ChevronLeft className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          {/* Права стрілка */}
          {activeSlide < benefitsData.length - 1 && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-1.5 top-[50%] -translate-y-1/2 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer"
              aria-label="Наступний слайд"
            >
              <ChevronRight className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {benefitsData.map((benefit, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 px-12 snap-center"
              >
                {renderCard(benefit, idx)}
              </div>
            ))}
          </div>

          {/* Точки пагінації */}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: benefitsData.length }).map((_, idx) => (
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
        <div className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch w-full">
          {benefitsData.map((benefit, index) => renderCard(benefit, index))}
        </div>

      </div>
    </section>
  );
}