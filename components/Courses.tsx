"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Clock, Calendar, CheckCircle2, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

export default function Courses() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleCard = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex(expandedIndex === index ? null : index);
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

  const coursesList = [
    {
      title: "Підготовка до школи",
      age: "5+",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Читання", "Письмо", "Математика", "Адаптація до шкільної атмосфери", "Логіка"],
      bgImage: "/courses-bg/school-prep.png",
    },
    {
      title: "Англійська мова",
      age: "4+",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Словниковий запас", "Правильна вимова", "Сприйняття мови на слух", "Пам'ять та увага", "Впевненість у спілкуванні"],
      bgImage: "/courses-bg/english.png",
    },
    {
      title: "Репетиторство",
      subtitle: "Основні предмети 1–4 клас",
      age: "6-10",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Додавання і віднімання", "Множення та ділення", "Розв'язування задач", "Логічні вправи", "Робота з числами та прикладами"],
      bgImage: "/courses-bg/tutoring.png",
    },
    {
      title: "Таблиця множення",
      age: "7-8",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Пояснюємо через прості приклади", "Використовуємо наочні матеріали", "Вивчаємо поступово", "Тренуємо швидкість через ігри", "Картки, змагання та інтерактив"],
      bgImage: "/courses-bg/multiplication.png",
    },
    {
      title: "Швидкочитання",
      age: "6-12",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Техніка читання", "Швидкість", "Увага", "Розуміння тексту"],
      bgImage: "/courses-bg/speed-reading.png",
    },
    {
      title: "Ментальна арифметика",
      age: "5-12",
      info: "2 рази \\ тиждень",
      online: "+ онлайн заняття",
      groupDuration: "55 хвилин — група",
      indivDuration: "40 хвилин — індивідуально",
      points: ["Розвиток мозку", "Швидкість мислення", "Увага та пам'ять", "Уява", "Швидкісний рахунок"],
      bgImage: "/courses-bg/mental-math.png",
    },
    {
      title: "Логопед",
      age: "4+",
      info: "2 рази \\ тиждень",
      online: "Індивідуальні заняття",
      groupDuration: "",
      indivDuration: "30 хвилин — індивідуально",
      points: ["Правильна вимова звуків", "Постановка та автоматизація", "Розвиток мовного дихання", "Збагачення словникового запасу", "Розвиток артикуляційного апарату"],
      bgImage: "/courses-bg/speech-therapy.png",
      isFullWidth: true,
    },
  ];

  const renderCard = (course: typeof coursesList[0], index: number, isDesktop = false) => {
    const isExpanded = expandedIndex === index;
    return (
      <div
        key={index}
        onClick={(e) => toggleCard(index, e)}
        className={`group relative flex flex-col justify-between rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] overflow-hidden cursor-pointer transition-all duration-100 ${isExpanded ? "h-auto" : "h-[200px] sm:h-[240px]"
          } ${isDesktop && course.isFullWidth ? "sm:col-span-2 lg:col-span-3 lg:max-w-[325px] lg:mx-auto lg:w-full" : ""
          }`}
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src={course.bgImage}
            alt={course.title}
            fill
            sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
            className="object-cover object-bottom"
          />
        </div>

        {/* Контрастний шар під текст */}
        <div className={`absolute inset-0 z-10 ${isExpanded ? "bg-white/95" : "bg-white/50"}`} />

        {/* Вміст картки */}
        <div className="relative z-20 p-4 flex flex-col justify-between h-full flex-1 gap-2 sm:gap-3">

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="max-w-[75%]">
                <h3 className="text-sm sm:text-lg font-black text-bg-header uppercase tracking-tight leading-tight bg-white/80 px-1 py-0.5 rounded-md inline-block">
                  {course.title}
                </h3>
                {"subtitle" in course && course.subtitle && (
                  <p className="text-[8px] sm:text-[9px] font-black text-brand-secondary uppercase mt-0.5 bg-white/80 px-1 rounded-sm w-fit">
                    {course.subtitle}
                  </p>
                )}

                <div className="text-[9px] sm:text-[10px] font-bold text-text-title mt-1.5 sm:mt-2 space-y-0.5 bg-white/80 p-1 rounded-md w-fit">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-brand-secondary flex-shrink-0" />
                    <span>{course.online}</span>
                  </div>
                  <div className="pl-4 text-text-muted">
                    <span>• {course.info}</span>
                  </div>
                </div>
              </div>

              {/* Вік */}
              <div className="flex flex-col items-center justify-center h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 rounded-full border-2 border-black bg-btn-ctaBg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[5px] sm:text-[6px] font-black uppercase text-black leading-none">вік</span>
                <span className="text-[10px] sm:text-xs font-black text-black leading-none mt-0.5">{course.age}</span>
              </div>
            </div>

            {/* Тривалість */}
            <div className="mt-2 flex flex-col gap-0.5 bg-white/90 border border-black/10 rounded-md p-1 sm:p-1.5 text-[8px] sm:text-[9px] font-extrabold text-text-title shadow-sm w-fit">
              {course.groupDuration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5 text-brand-secondary flex-shrink-0" />
                  <span>{course.groupDuration}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-bg-header flex-shrink-0" />
                <span>{course.indivDuration}</span>
              </div>
            </div>

            {/* Блок програми */}
            {isExpanded && (
              <div className="mt-3 pt-2 border-t border-black/10 animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[10px] font-black uppercase text-brand-secondary tracking-wider mb-1.5">Програма курсу:</p>
                <ul className="space-y-1 pb-1">
                  {course.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center gap-1.5 text-xs font-extrabold text-text-title uppercase tracking-tight">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-secondary flex-shrink-0 stroke-[3]" />
                      <span className="bg-white/60 rounded-sm px-0.5">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Кнопка внизу */}
          <div
            onClick={(e) => toggleCard(index, e)}
            className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-black/10 flex items-center justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black bg-white/60 rounded-b-md px-1"
          >
            <span>{isExpanded ? "Сховати" : "Детальніше"}</span>
            <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-btn-ctaBg group-hover:text-btn-ctaText group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all duration-100">
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
              ) : (
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
              )}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section id="courses" className="relative bg-transparent pt-16 pb-20 border-t-2 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Заголовок блоку */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight text-text-title sm:text-4xl uppercase">
            Наші напрями
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
        </div>

        {/* МОБІЛЬНИЙ КАРУСЕЛЬ (2 картки в стовпчик на слайд) */}
        <div className="sm:hidden relative w-full overflow-hidden">

          {/* Ліва стрілка */}
          {activeSlide > 0 && expandedIndex === null && (
            <button
              onClick={() => scroll("left")}
              className={`absolute left-1.5 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer -translate-y-1/2 ${activeSlide === 3 ? "top-[100px]" : "top-[208px]"
                }`}
              aria-label="Попередній слайд"
            >
              <ChevronLeft className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          {/* Права стрілка */}
          {activeSlide < Math.ceil(coursesList.length / 2) - 1 && expandedIndex === null && (
            <button
              onClick={() => scroll("right")}
              className={`absolute right-1.5 z-30 flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer -translate-y-1/2 ${activeSlide === 3 ? "top-[100px]" : "top-[208px]"
                }`}
              aria-label="Наступний слайд"
            >
              <ChevronRight className="h-8 w-8 stroke-[4.5]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 transition-all duration-300 ${
              expandedIndex !== null
                ? "h-auto min-h-[440px]"
                : activeSlide === 3
                  ? "h-[224px]"
                  : "h-[440px]"
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.from({ length: Math.ceil(coursesList.length / 2) }).map((_, colIndex) => {
              const pair = coursesList.slice(colIndex * 2, colIndex * 2 + 2);
              return (
                <div
                  key={colIndex}
                  className="w-full flex-shrink-0 flex flex-col gap-4 px-12 snap-center"
                >
                  {pair.map((course, idx) => renderCard(course, colIndex * 2 + idx, false))}
                </div>
              );
            })}
          </div>

          {/* Точки пагінації */}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: Math.ceil(coursesList.length / 2) }).map((_, idx) => (
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
        <div className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto items-start">
          {coursesList.map((course, index) => renderCard(course, index, true))}
        </div>

      </div>
    </section>
  );
}