"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Компонент для лічильника цифр (Number Ticker)
const ExperienceCounter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const duration = 1200; // Швидка анімація за 1.2 секунди
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={containerRef}>{count}</span>;
};

export default function Teachers() {
  const teachersList = [
    {
      name: "Марія Ковальчук",
      role: "Засновниця & Англійська мова",
      bio: "Магістр філології. Розробила авторську інтерактивну програму, яка допомагає дітям закохатися в англійську з першого уроку.",
      exp: 5,
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Олена Петрова",
      role: "Методист з підготовки до школи",
      bio: "Дитячий психолог. Знає, як м'яко адаптувати дитину до школи, розвинути логіку та навчити читати без стресу.",
      exp: 4,
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Тетяна Сидоренко",
      role: "Арифметика та логіка",
      bio: "Спеціаліст з ментальної арифметики та ейдетики. Розвиває пам'ять, концентрацію та швидкість мислення через гру.",
      exp: 3,
      img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <section id="teachers" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок блоку */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-black tracking-tight text-text-title sm:text-3xl uppercase">
            Наші викладачі
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
          <p className="mt-3 text-sm font-medium text-text-muted">
            Команда молодих професіоналів, які розмовляють з дітьми однією мовою
          </p>
        </div>

        {/* Сітка карток */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {teachersList.map((teacher, index) => (
            <div
              key={index}
              className="animate-fade-in-up group relative flex flex-col justify-between rounded-3xl border border-slate-300/60 bg-white p-5 transition-all duration-300 hover:border-text-title overflow-hidden opacity-0"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              <div>
                {/* Верхній ряд: Маленький аватар зліва + текст справа */}
                <div className="flex items-center gap-4">
                  {/* Аватар зменшено більше ніж в половину (h-16 w-16 замість величезного блоку) */}
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={teacher.img}
                      alt={teacher.name}
                      fill
                      sizes="64px"
                      className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105"
                      onLoadingComplete={(img) => img.classList.remove("opacity-0")}
                    />
                  </div>
                  
                  {/* Ім'я та роль */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-text-title tracking-tight truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-[11px] font-extrabold tracking-wider text-btn-ctaBgHover uppercase mt-0.5 leading-tight">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                {/* Блок з досвідом — тепер акуратний рядок під аватаром */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-text-title">
                  <span className="flex h-6 px-2 items-center justify-center rounded-lg bg-text-title text-brand-primary text-xs font-black">
                    <ExperienceCounter target={teacher.exp} />+
                  </span>
                  <span className="text-[11px] font-medium text-text-muted italic">років професійного стажу</span>
                </div>

                {/* Опис викладача */}
                <p className="mt-3.5 text-xs font-medium leading-relaxed text-text-muted">
                  {teacher.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}