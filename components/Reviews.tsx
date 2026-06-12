"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const reviewsData = [
    {
      author: "Мама Марка",
      text: "Доброго дня. Маркові сподобався урок. Сказав що гарна і привітна вчителька ❤️ Ми будемо продовжувати навчання.",
    },
    {
      author: "Мама Ярослава",
      text: "Доброго вечора, Ярославу дуже сподобалось, ми також будемо надалі займатися",
    },
    {
      author: "Мама Мілани",
      text: "Доброго дня 😊 Мілані дуже сподобалося і хочемо продовжити навчання 😊",
    },
    {
      author: "Мама Даниїла",
      text: "Даниїл буде продовжувати навчання. Все сподобалось. Вам дякую 🌷",
    },
    {
      author: "Мама Аліси",
      text: "Алісі заняття сподобалось, сказала, що було цікаво 😎 Будемо продовжувати відвідувати заняття.",
    },
  ];

  const getAuthorIcon = (author: string, index: number) => {
    const lower = author.toLowerCase();
    if (lower.includes("тато") || lower.includes("батько") || lower.includes("татові")) {
      const maleIcons = ["👨", "👨‍🎓", "👨‍🎨"];
      return maleIcons[index % maleIcons.length];
    }
    // 3 максимально відмінних жіночих емодзі, щоб у трійці видимих відгуків вони ніколи не повторювалися
    const femaleIcons = ["👩", "👩‍🎓", "👩‍🎨"];
    return femaleIcons[index % femaleIcons.length];
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Відстеження жестів натискання та перетягування на мобільних пристроях і десктопі
  useEffect(() => {
    if (!emblaApi) return;

    const handlePointerDown = () => setIsInteracting(true);
    const handlePointerUp = () => setIsInteracting(false);

    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    return () => {
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
  }, [emblaApi]);

  // Ефект автопрокрутки раз на 4 секунди, якщо користувач не навів мишку та не взаємодіє пальцем
  useEffect(() => {
    if (!emblaApi || isHovered || isInteracting) return;

    const autoplay = () => {
      emblaApi.scrollNext();
    };

    const interval = setInterval(autoplay, 4000);
    return () => clearInterval(interval);
  }, [emblaApi, isHovered, isInteracting]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section id="reviews" className="relative bg-transparent pt-20 pb-24 border-t-2 border-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Строгий заголовок */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-black text-text-muted uppercase tracking-widest">
            Зворотний зв'язок
          </span>
          <h2 className="text-3xl font-black tracking-tight text-text-title sm:text-4xl mt-2 uppercase">
            Що говорять наші батьки
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
        </div>

        {/* НАВІГАЦІЯ ПО БОКАХ ВІД ЦИТАТ */}
        <div className="relative flex items-center justify-center w-full px-10 sm:px-24 lg:px-24">
          
          {/* Ліва мобільна стрілка */}
          <button
            onClick={scrollPrev}
            className="absolute left-1.5 top-[50%] -translate-y-1/2 z-30 sm:hidden flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer"
            aria-label="Попередній слайд"
          >
            <ChevronLeft className="h-8 w-8 stroke-[4.5]" />
          </button>

          {/* Ліва десктопна кнопка */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 sm:left-4 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white/90 backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 hover:bg-btn-ctaBg hover:text-black hover:border-black transition-all active:scale-95 cursor-pointer"
            aria-label="Попередній відгук"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Embla Viewport */}
          <div 
            className="overflow-hidden w-full pb-8" 
            ref={emblaRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex">
              {reviewsData.map((review, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 px-6 flex flex-col"
                >
                  {/* Нове графічне рішення: Аватар з ім'ям */}
                  <div className="flex items-center gap-3.5 mb-5 ml-1 select-none">
                    {/* Контрастна кругла плашка-аватар з іконкою */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] z-10 relative">
                        {getAuthorIcon(review.author, index)}
                      </div>
                      {/* Міні-декор у вигляді сердечка */}
                      <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full border border-black bg-[#facc15] flex items-center justify-center text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20">
                        ❤️
                      </div>
                    </div>
                    
                    {/* Текстова інформація */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider text-text-title leading-tight">
                        {review.author}
                      </span>
                    </div>
                  </div>

                  {/* 2. ПОВЕРНУТО: Попередня оригінальна хмаринка прямої мови */}
                  <div className="relative rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 min-h-[120px] flex items-center">
                    <p className="text-xs sm:text-sm text-text-body leading-relaxed font-bold italic">
                      «{review.text}»
                    </p>

                    {/* Попередній трикутний хвостик хмаринки зліва зверху */}
                    <div className="absolute -top-[8px] left-6 w-3 h-3 bg-white border-t-2 border-l-2 border-black rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Права мобільна стрілка */}
          <button
            onClick={scrollNext}
            className="absolute right-1.5 top-[50%] -translate-y-1/2 z-30 sm:hidden flex items-center justify-center text-black/35 active:text-black/75 active:scale-75 transition-all cursor-pointer"
            aria-label="Наступний слайд"
          >
            <ChevronRight className="h-8 w-8 stroke-[4.5]" />
          </button>

          {/* Права десктопна кнопка */}
          <button
            onClick={scrollNext}
            className="absolute right-2 sm:right-4 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white/90 backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 hover:bg-btn-ctaBg hover:text-black hover:border-black transition-all active:scale-95 cursor-pointer"
            aria-label="Наступний відгук"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Точки пагінації для мобілок */}
        <div className="flex justify-center gap-2 mt-4 sm:hidden">
          {reviewsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 rounded-full border-2 border-black transition-all duration-150 cursor-pointer ${selectedIndex === idx ? "w-6 bg-btn-ctaBg" : "w-2.5 bg-white"
                }`}
              aria-label={`Перейти до слайду ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}