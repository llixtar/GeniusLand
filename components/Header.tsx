"use client";

import { useState } from "react";
import Link from "next/link"; // Додали імпорт для переходу на окрему сторінку
import { Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Курси", href: "/#courses", isPage: false },
    { name: "Викладачі", href: "/#teachers", isPage: false },
    { name: "Ціни", href: "/#prices", isPage: false },
    { name: "Корисна інформація", href: "/blog", isPage: true }, // НАШ НОВИЙ ПУНКТ
  ];

  const mobileMenuItems = [
    { name: "Курси", href: "/#courses", isPage: false },
    { name: "Викладачі", href: "/#teachers", isPage: false },
    { name: "Ціни", href: "/#prices", isPage: false },
    { name: "Результати", href: "/#benefits", isPage: false },
    { name: "Фотогалерея", href: "/#gallery", isPage: false },
    { name: "Відгуки", href: "/#reviews", isPage: false },
    { name: "Корисна інформація", href: "/blog", isPage: true },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl border-2 border-black backdrop-blur-md rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-bg-header/90">
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Логотип — 3D-кнопка для повернення вгору */}
        <Link 
          href="/#hero" 
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              const heroSection = document.getElementById("hero");
              if (heroSection) {
                heroSection.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative h-14 w-14 flex-shrink-0 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] overflow-hidden">
            <img
              src="/genius_logo.svg"
              alt="Genius Land Logo"
              className="h-full w-full object-cover scale-110"
            />
          </div>

          <div>
            <span className="text-lg font-brand font-black tracking-tight text-brand-logoName sm:text-xl uppercase block group-hover:text-btn-ctaBg transition-colors">
              GeniusLand
            </span>
            <span className="block text-[10px] font-nav font-bold text-btn-ctaBg tracking-wide">
              ШКОЛА РОЗВИТКУ • ХОТИН
            </span>
          </div>
        </Link>

        {/* Десктопне Меню */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {menuItems.map((item) =>
            item.isPage ? (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs xl:text-sm font-nav font-black uppercase tracking-wider text-black transition-colors hover:text-btn-ctaBg whitespace-nowrap"
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                className="text-xs xl:text-sm font-nav font-black uppercase tracking-wider text-black transition-colors hover:text-btn-ctaBg whitespace-nowrap"
              >
                {item.name}
              </a>
            )
          )}
        </nav>

        {/* Контакти та Кнопка */}
        <div className="hidden md:flex items-center gap-4 xl:gap-6">
          <div className="flex flex-col items-start leading-none gap-1">
            <a
              href="tel:+380987580211"
              className="group flex items-center gap-1.5 text-[11px] xl:text-xs font-nav font-black uppercase tracking-wider text-black hover:text-btn-ctaBg transition-colors whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5 text-brand-secondary group-hover:text-btn-ctaBg stroke-[2.5] transition-colors" />
              <span>+38 (098) 758 02 11</span>
            </a>
            <a
              href="tel:+380991721452"
              className="group flex items-center gap-1.5 text-[11px] xl:text-xs font-nav font-black uppercase tracking-wider text-black hover:text-btn-ctaBg transition-colors whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5 text-brand-secondary group-hover:text-btn-ctaBg stroke-[2.5] transition-colors" />
              <span>+38 (099) 172 14 52</span>
            </a>
          </div>

          <a
            href="/#contacts"
            className="rounded-xl bg-white/20 backdrop-blur-md border-2 border-black px-4 xl:px-5 py-2 text-xs font-button font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-white/35 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:scale-[0.97] transition-all duration-75 whitespace-nowrap"
          >
            Записатись
          </a>
        </div>

        {/* Кнопка мобільного меню */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 text-black hover:bg-black/5 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобільне Меню */}
      {isOpen && (
        <div className="lg:hidden border-t border-black/10 bg-bg-main px-4 pt-4 pb-6 rounded-b-2xl transition-all">
          <div className="space-y-3">
            <div className="flex flex-col">
              {mobileMenuItems.map((item, index) => {
                const linkContent = item.isPage ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-nav font-black uppercase tracking-wider text-black hover:bg-black/5 hover:text-brand-secondary active:scale-[0.98] transition-all duration-75"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-nav font-black uppercase tracking-wider text-black hover:bg-black/5 hover:text-brand-secondary active:scale-[0.98] transition-all duration-75"
                  >
                    {item.name}
                  </a>
                );

                return (
                  <div key={item.name}>
                    {linkContent}
                    {index < mobileMenuItems.length - 1 && (
                      <div className="h-px bg-black/[0.06] my-1 mx-3" />
                    )}
                  </div>
                );
              })}
            </div>
            <hr className="my-4 border-black/10" />
            <a
              href="tel:+380987580211"
              className="group flex items-center gap-3 px-3 py-2 text-base font-nav font-black uppercase tracking-wider text-black hover:text-btn-ctaBg transition-colors"
            >
              <Phone className="h-5 w-5 text-brand-secondary group-hover:text-btn-ctaBg transition-colors" />
              <span>+38 (098) 758 02 11</span>
            </a>
            <a
              href="tel:+380991721452"
              className="group flex items-center gap-3 px-3 py-2 text-base font-nav font-black uppercase tracking-wider text-black hover:text-btn-ctaBg transition-colors"
            >
              <Phone className="h-5 w-5 text-brand-secondary group-hover:text-btn-ctaBg transition-colors" />
              <span>+38 (099) 172 14 52</span>
            </a>

            <a
              href="/#contacts"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-xl bg-white/20 backdrop-blur-md border-2 border-black py-3 text-center text-base font-button font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white/35 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.97] transition-all duration-75"
            >
              Записатись
            </a>
          </div>
        </div>
      )}
    </header>
  );
}