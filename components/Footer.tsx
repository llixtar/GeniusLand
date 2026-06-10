"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* bg-bg-header — фарбуємо в колір хедера, lg:rounded-b-2xl — красиво закриваємо кути планшета */
    <footer className="w-full bg-bg-header pt-6 pb-8 text-white lg:rounded-b-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto text-center sm:text-left">
          
          {/* Назва та копірайт */}
          <div>
            <span className="text-sm font-black tracking-tight uppercase color-brand-logoName">
              GeniusLand
            </span>
            <p className="mt-0.5 text-[11px] font-medium text-slate-300">
              &copy; {currentYear} Усі права захищені.
            </p>
          </div>

          {/* Підпис без смайликів */}
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200">
            Зроблено з любов'ю для найкращих дітей
          </div>

        </div>
      </div>
    </footer>
  );
}