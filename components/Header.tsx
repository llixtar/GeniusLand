"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Про нас", href: "#about" },
    { name: "Курси", href: "#courses" },
    { name: "Викладачі", href: "#teachers" },
    { name: "Ціни", href: "#prices" },
  ];

  return (
    // ОБНОВА: Тепер хедер акуратний, по центру, літає при скролі та має 3D стиль
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl border-2 border-black bg-bg-header/90 backdrop-blur-md rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Логотип — 3D-кнопка для повернення вгору */}
        <a href="#hero" className="flex items-center gap-3 cursor-pointer group">
          {/* Круглий контейнер з ефектом натискання */}
          <div className="relative h-14 w-14 flex-shrink-0 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] overflow-hidden">
            <img
              src="/genius_logo.svg"
              alt="Genius Land Logo"
              className="h-full w-full object-cover scale-110"
            />
          </div>

          {/* Текстова частина */}
          <div>
            <span className="text-lg font-black tracking-tight text-brand-logoName sm:text-xl uppercase block group-hover:text-btn-ctaBg transition-colors">
              GeniusLand
            </span>
            <span className="block text-[10px] font-bold text-btn-ctaBg tracking-wide">
              ШКОЛА РОЗВИТКУ • ХОТИН
            </span>
          </div>
        </a>

        {/* Десктопне Меню */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-black uppercase tracking-wider text-black transition-colors hover:text-btn-ctaBg"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Контакти та Кнопка */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="tel:+380000000000"
            className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black hover:text-brand-secondary transition-colors"
          >
            <Phone className="h-4 w-4 text-brand-secondary stroke-[2.5]" />
            <span>+38 (0XX) XXX-XX-XX</span>
          </a>

          <a
            href="#register"
            className="rounded-xl bg-btn-ctaBg border-2 border-black px-5 py-2 text-xs font-black uppercase tracking-wider text-btn-ctaText shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
          >
            Записатись
          </a>
        </div>

        {/* Кнопка мобільного меню */}
        <div className="flex md:hidden">
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
        <div className="md:hidden border-t border-black/10 bg-bg-header px-4 pt-4 pb-6 rounded-b-2xl transition-all">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-black uppercase tracking-wider text-black hover:bg-black/5 hover:text-brand-secondary"
              >
                {item.name}
              </a>
            ))}
            <hr className="my-4 border-black/10" />
            <a
              href="tel:+380000000000"
              className="flex items-center gap-3 px-3 py-2 text-base font-black uppercase tracking-wider text-black"
            >
              <Phone className="h-5 w-5 text-brand-secondary" />
              <span>+38 (0XX) XXX-XX-XX</span>
            </a>

            <a
              href="#register"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-xl bg-btn-ctaBg border-2 border-black py-3 text-center text-base font-black uppercase tracking-wider text-btn-ctaText shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
            >
              Записатись
            </a>
          </div>
        </div>
      )}
    </header>
  );
}