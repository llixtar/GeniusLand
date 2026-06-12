"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

export default function Teachers() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const teachersData = [
    {
      name: "Гайсенюк Марина",
      role: "Засновниця GaniusLand",
      image: "/teachers/maryna.jpg",
      experience: "4 роки роботи з дітьми",
      quote: "Вірить, що навчання може бути в радість, а не через змушування..",
      bullets: [
        "Ментальна арифметика",
        "Швидкочитання",
        "Підготовка до школи",
        "Репетиторство"
      ]
    },
    {
      name: "Чопчик Тетяна",
      role: "Логопед центру",
      image: "/teachers/tetiana.jpg",
      experience: "8 років роботи з дітьми дошкільного та молодшого шкільного віку",
      subExperience: "Профільна освіта з логопедії",
      quote: "Вірить, що кожна дитина може заговорити впевнено",
      bullets: [
        "Сучасні корекційні методики",
        "Індивідуальний підхід",
        "Формування правильної вимови"
      ]
    },
    {
      name: "Перепелюк Анна",
      role: "Викладач англійської мови",
      image: "/teachers/anna.jpg",
      experience: "4 роки досвіду роботи з дітьми 5-15 років",
      quote: "Вірить, що навчання може бути в легкість та задоволення",
      bullets: [
        "Вивчення нових слів",
        "Діти починають вільно говорити",
        "Навчання через ігри та інтерактиви"
      ]
    },
    {
      name: "Алевтина",
      role: "Викладач англійської мови",
      image: "/teachers/alevtina.jpg",
      experience: "2 роки досвіду роботи",
      quote: "Сприяє розвитку впевненості у спілкуванні англійською.",
      bullets: [
        "Вивчення мови легко, цікаво та без страху помилок",
        "Поєднує інтерактивні завдання, ігрові елементи та комунікативний підхід",
        "Працює з урахуванням віку, рівня знань та потреб кожного учня"
      ]
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

  const renderCard = (teacher: typeof teachersData[0], index: number, isDesktop = false) => {
    return (
      <div
        key={index}
        className={
          isDesktop
            ? "group relative flex flex-col justify-between rounded-3xl border border-black bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 w-full"
            : "group relative flex flex-col justify-between rounded-3xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 ease-in-out w-full"
        }
      >
        <div>
          {/* Аватар кружечок */}
          <div
            className={
              isDesktop
                ? "relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-50 border border-black shadow-sm transition-transform duration-300 group-hover:scale-105"
                : "relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none"
            }
          >
            <Image
              src={teacher.image}
              alt={teacher.name}
              fill
              className={`object-cover filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-300 ${
                teacher.name === "Гайсенюк Марина"
                  ? "scale-[1.75] object-[center_30%] group-hover:scale-[1.85]"
                  : "object-top group-hover:scale-[1.05]"
              }`}
              sizes="(max-w-7xl) 25vw, 112px"
              priority={index < 2}
            />
          </div>

          {/* Інформація про викладача */}
          <div className="mt-4 text-center">
            <h3 className="text-base font-black tracking-tight text-text-title leading-tight uppercase">
              {teacher.name}
            </h3>
            <p className="text-[11px] font-black text-brand-secondary mt-1 uppercase tracking-wider leading-none">
              {teacher.role}
            </p>
            
            {/* Досвід роботи */}
            <div
              className={
                isDesktop
                  ? "mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-text-title bg-slate-50 border border-black rounded-xl py-0.5 px-2.5 w-fit mx-auto"
                  : "mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-black text-text-title bg-slate-50 border-2 border-black rounded-xl py-0.5 px-2.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] w-fit mx-auto"
              }
            >
              <GraduationCap className="h-3 w-3 text-brand-secondary flex-shrink-0" />
              <span className="leading-tight">{teacher.experience}</span>
            </div>
            
            {teacher.subExperience && (
              <p className="text-[9px] text-text-muted mt-1.5 font-bold uppercase tracking-tight text-center leading-tight">
                {teacher.subExperience}
              </p>
            )}
            
            <div className="mt-3.5 h-[1.5px] w-full bg-black/10" />
          </div>

          {/* Спеціалізація */}
          <div className="mt-3">
            <p className="text-[9px] font-black text-text-title/40 uppercase tracking-widest mb-1.5 text-center">
              Спеціалізація:
            </p>
            <ul className="space-y-1 text-center">
              {teacher.bullets.map((bullet, idx) => (
                <li key={idx} className="text-xs font-bold text-text-body leading-tight">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Цитата викладача */}
        <div className="mt-4 pt-3 border-t-2 border-black/10 text-center">
          <p className="text-xs font-bold text-text-muted italic leading-relaxed px-4">
            «{teacher.quote}»
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="teachers" className="relative bg-transparent pt-16 pb-20 border-t-2 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Бруталістичний заголовок зі строгим стилем */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight text-text-title sm:text-4xl uppercase">
             Наш викладацький склад
          </h2>
          <p className="text-xs font-black text-text-muted uppercase tracking-widest mt-2.5">
            Професіоналізм, досвід та індивідуальний підхід
          </p>
          <div className="mt-3 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
        </div>

        {/* МОБІЛЬНИЙ КАРУСЕЛЬ (по 1 викладачу на слайд) */}
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
          {activeSlide < teachersData.length - 1 && (
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
            {teachersData.map((teacher, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 px-12 snap-center"
              >
                {renderCard(teacher, idx, false)}
              </div>
            ))}
          </div>

          {/* Точки пагінації */}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: teachersData.length }).map((_, idx) => (
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
        <div className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch justify-center w-full">
          {teachersData.map((teacher, index) => renderCard(teacher, index, true))}
        </div>

      </div>
    </section>
  );
}