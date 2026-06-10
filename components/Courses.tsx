"use client";

import { ArrowRight, BookOpen, GraduationCap, Binary, Smile, HelpCircle, Laptop } from "lucide-react";

export default function Courses() {
  const coursesList = [
    {
      title: "Підготовка до школи",
      age: "5-7 років",
      desc: "Читання, письмо, математика, логіка та м'яка адаптація до майбутнього навчання.",
      icon: <GraduationCap className="h-5 w-5" />,
      tag: "Популярно",
    },
    {
      title: "Англійська мова",
      age: "4-12 років",
      desc: "Вивчаємо мову через інтерактивні ігри, пісні та живе спілкування.",
      icon: <BookOpen className="h-5 w-5" />,
      tag: "Усі рівні",
    },
    {
      title: "Арифметика & Логіка",
      age: "6-10 років",
      desc: "Розвиток швидкості мислення, пам'яті та концентрації уваги.",
      icon: <Binary className="h-5 w-5" />,
      tag: "Інтелект",
    },
    {
      title: "Заняття з логопедом",
      age: "3-8 років",
      desc: "Індивідуальні уроки для постановки звуків та розвитку мовлення.",
      icon: <Smile className="h-5 w-5" />,
      tag: "Персонально",
    },
    {
      title: "Репетиторство",
      age: "6-10 років",
      desc: "Допомога з домашніми завданнями для учнів початкових класів (1-4).",
      icon: <HelpCircle className="h-5 w-5" />,
      tag: "Школа",
    },
    {
      title: "Онлайн-консультація",
      age: "Для батьків",
      desc: "Дистанційна порада спеціаліста щодо розвитку, навчання чи мовлення дитини.",
      icon: <Laptop className="h-5 w-5" />,
      tag: "Дистанційно",
    },
  ];

  return (
    <section id="courses" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок блоку */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-black tracking-tight text-text-title sm:text-3xl uppercase">
            Напрямки навчання
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
          <p className="mt-3 text-sm font-medium text-text-muted">
            Оберіть курс для гармонійного розвитку вашої дитини
          </p>
        </div>

        {/* Сітка карток: Тепер рівно 6 штук, стають ідеально 3х2 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {coursesList.map((course, index) => (
            <div
              key={index}
              className="animate-fade-in-up group relative flex flex-col justify-between rounded-3xl bg-[#F6D8AE] p-6 border border-white/20 shadow-[6px_6px_16px_rgba(163,130,95,0.4),_-6px_-6px_16px_rgba(255,255,255,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_24px_rgba(163,130,95,0.5),_-10px_-10px_24px_rgba(255,255,255,0.9)] cursor-pointer overflow-hidden opacity-0"
              style={{ 
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              {/* Контент картки */}
              <div>
                <div className="flex items-center justify-between">
                  {/* Втиснута іконка */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6D8AE] text-bg-header shadow-[inset_2px_2px_5px_rgba(163,130,95,0.3),_inset_-2px_-2px_5px_rgba(255,255,255,0.6)] border border-white/10 transition-all duration-300 group-hover:bg-bg-header group-hover:text-white group-hover:shadow-none">
                    {course.icon}
                  </div>
                  {/* Бейдж */}
                  <span className="rounded-full bg-[#F6D8AE] px-2.5 py-0.5 text-[11px] font-bold text-text-muted shadow-[2px_2px_5px_rgba(163,130,95,0.2),_-2px_-2px_5px_rgba(255,255,255,0.5)] border border-white/20 transition-colors duration-300 group-hover:bg-btn-ctaBg group-hover:text-btn-ctaText">
                    {course.tag}
                  </span>
                </div>

                {/* Назва курсу */}
                <h3 className="mt-5 text-xl font-black text-text-title group-hover:text-bg-header transition-colors duration-300">
                  {course.title}
                </h3>
                
                {/* Вік */}
                <span className="mt-1 inline-block text-xs font-extrabold tracking-wider text-btn-ctaBgHover uppercase">
                  Вік: {course.age}
                </span>

                {/* Опис */}
                <p className="mt-3 text-xs font-medium leading-relaxed text-text-muted group-hover:text-text-body transition-colors duration-300">
                  {course.desc}
                </p>
              </div>

              {/* Нижня частина */}
              <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-text-title">
                <span className="group-hover:text-bg-header transition-colors">Дізнатись більше</span>
                {/* Втиснуте коло стрілочки */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6D8AE] border border-white/20 text-text-title shadow-[2px_2px_5px_rgba(163,130,95,0.2),_-2px_-2px_5px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:bg-btn-ctaBg group-hover:text-btn-ctaText group-hover:translate-x-1 group-hover:shadow-none">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}