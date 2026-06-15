"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Fade from "embla-carousel-fade";
import AutoHeight from "embla-carousel-auto-height";

export function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  }, [Fade(), AutoHeight()]);

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
    {
      author: "Мама дитини",
      text: "Добрий день, дякую, дитині все сподобалось.",
    },
    {
      author: "Мама учениці",
      text: "Доброго дня, так все дуже сподобалось і вона була задоволена. Гарно дякую вам за це. Ми б хотіли далі займатись з вами, скажіть будь ласка як і куди здійснити оплату?",
    },
    {
      author: "Мама Соломійки",
      text: "Доброго дня, хотіла подякувати за терпіння та професійність. Соломійка з радістю йде на кожне заняття, бо вони проходять у цікавій ігровій формі. Для мене було важливо, щоб встановили контакт із нею — і вам це вдалося на 100%.",
    },
    {
      author: "Мама дитини",
      text: "Ми дякуємо логопеду Тетяні Чопчик! Дитина із задоволенням відвідує заняття завдяки кваліфікованим діям спеціаліста. Бачимо позитивний результат.",
    },
    {
      author: "Мама сина",
      text: "Щиро дякуємо Вам за професіоналізм та підхід до дитини. Син із великим задоволенням відвідує заняття, які завжди нові та дуже цікаві, а саме в ігровій формі. Результат помітний вже через кілька занять. Ви чудовий спеціаліст.",
    },
    {
      author: "Мама донечки",
      text: "Доброго дня! Моя донечка займається в \"GeniusLand\" від самого відкриття. Відвідує заняття з англійської мови. Я дуже задоволена, заняття ідуть на користь, дитина з нетерпінням чекає, виконує самостійно домашнє завдання без нагадувань. Анна Сергіївна - то любов з першого заняття, вона розуміє діток, вміє знайти підхід. Ми дуже задоволені🥰",
    },
    {
      author: "Мама сина",
      text: "Мій син із задоволенням відвідує школу ментальної арифметики. Викладач Марина дуже приємна, уважна та вміє зацікавити дітей навчанням. Я бачу гарні результати й прогрес у сина. Дуже задоволена🌸",
    },
    {
      author: "Мама Максима і Дані",
      text: "Доброго вечора! Дітям сподобалось, вони задоволені. На уроці була довірлива атмосфера, було цікаво. Максим і Даня будуть продовжувати навчання.",
    },
    {
      author: "Мама Софії",
      text: "Доброго вечора 🌹 Софія просто в захваті. Ми продовжуємо навчання.",
    },
    {
      author: "Мама Тимофія",
      text: "Доброго вечора! Тимофій також у захваті від уроку. Продовжуємо ✔️😉",
    },
    {
      author: "Мама донечки",
      text: "Ваші заняття чудові, вони дуже подобаються моїй донечці, і кожного разу вона з нетерпінням чекає наступного уроку. Особливо хочу відзначити вчительку - вона чудово вміє тримати увагу дитини навіть у форматі онлайн. Заняття проходять цікаво, різноманітно, і у форматі гри, моя дитина активно залучена в процес і отримує задоволення від навчання. Дякую за такий чудовий підхід до своєї справи.❤️",
    },
    {
      author: "Мама сина",
      text: "Доброго дня. Вчителька хороша, позитивна, пояснює доступно. Сину подобається. Про результат говорити ще рано, адже займаємось лише місяць, хоч за місяць він вивчив більше, ніж за рік. Рухаємось далі 😉",
    },
    {
      author: "Мама дитини",
      text: "Щиро дякуємо за заняття! Найголовніший показник для мене — те, що дитина біжить на уроки з задоволенням і її не потрібно змушувати. Вчителю вдалося знайти підхід і зацікавити, англійська тепер у нас — улюблений предмет. Дуже рада, що ми обрали саме вас!",
    },
  ];

  const [reviewsList, setReviewsList] = useState<any[]>(reviewsData);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  const calculateHeights = useCallback(() => {
    setMaxHeight(null);
    requestAnimationFrame(() => {
      const slideElements = document.querySelectorAll(".review-card-bubble");
      let maxH = 0;
      slideElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const originalHeight = htmlEl.style.height;
        htmlEl.style.height = "auto";
        const h = htmlEl.offsetHeight;
        htmlEl.style.height = originalHeight;
        if (h > maxH) maxH = h;
      });
      if (maxH > 0) {
        setMaxHeight(maxH);
      }
    });
  }, [reviewsList]);

  useEffect(() => {
    if (reviewsList.length === 0) return;
    calculateHeights();
    window.addEventListener("resize", calculateHeights);
    return () => window.removeEventListener("resize", calculateHeights);
  }, [reviewsList, calculateHeights]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setReviewsList(data);
        }
      } catch (err) {
        console.error("Error fetching reviews from Supabase:", err);
      }
    };
    fetchReviews();
  }, []);

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
        <div 
          className="relative flex items-center justify-center w-full max-w-2xl mx-auto px-10 sm:px-16"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
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
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white/90 backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 hover:bg-btn-ctaBg hover:text-black hover:border-black transition-all active:scale-95 cursor-pointer"
            aria-label="Попередній відгук"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Embla Viewport */}
          <div 
            key={reviewsList.length}
            className="overflow-hidden w-full pb-8" 
            ref={emblaRef}
          >
            <div className="flex">
              {reviewsList.map((review, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 px-6 flex flex-col"
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
                  <div 
                    className="review-card-bubble relative rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center select-none w-full"
                    style={maxHeight ? { height: `${maxHeight}px` } : undefined}
                  >
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
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white/90 backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-800 hover:bg-btn-ctaBg hover:text-black hover:border-black transition-all active:scale-95 cursor-pointer"
            aria-label="Наступний відгук"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Точки пагінації */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
          {reviewsList.map((_, idx) => (
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