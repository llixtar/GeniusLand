"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Головна", href: "#hero" },
    { name: "Про нас", href: "#about" },
    { name: "Курси", href: "#courses" },
    { name: "Викладачі", href: "#teachers" },
    { name: "Ціни", href: "#prices" },
    { name: "Контакти", href: "#contacts" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-bg-header backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Логотип */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/20 shadow-sm">
            <Image
              src="/genius_logo.jpg"
              alt="Genius Land Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-brand-logoName sm:text-2xl uppercase">
              GeniusLand
            </span>
            <span className="block text-xs font-bold text-btn-ctaBg tracking-wide">
              ШКОЛА РОЗВИТКУ • ХОТИН
            </span>
          </div>
        </div>

        {/* Десктопне Меню (текст тепер світлий) */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-bold text-text-headerLinks transition-colors hover:text-btn-ctaBg"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Контакти та Кнопка (текст тепер світлий) */}
        <div className="hidden md:flex items-center gap-6">
          <a 
            href="tel:+380000000000" 
            className="flex items-center gap-2 text-sm font-bold text-text-headerLinks hover:text-btn-ctaBg transition-colors"
          >
            <Phone className="h-4 w-4 text-btn-ctaBg" />
            <span>+38 (0XX) XXX-XX-XX</span>
          </a>
          <a
            href="#register"
            className="rounded-full bg-btn-ctaBg hover:bg-btn-ctaBgHover px-6 py-2.5 text-sm font-bold text-btn-ctaText shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Записатись
          </a>
        </div>

        {/* Кнопка мобільного меню */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 text-text-headerLinks hover:bg-white/10 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобільне Меню */}
      {isOpen && (
        <div className="md:hidden border-b border-white/10 bg-bg-header px-4 pt-2 pb-6 shadow-lg transition-all">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-bold text-text-headerLinks hover:bg-white/10 hover:text-btn-ctaBg"
              >
                {item.name}
              </a>
            ))}
            <hr className="my-4 border-white/10" />
            <a
              href="tel:+380000000000"
              className="flex items-center gap-3 px-3 py-2 text-base font-bold text-text-headerLinks"
            >
              <Phone className="h-5 w-5 text-btn-ctaBg" />
              <span>+38 (0XX) XXX-XX-XX</span>
            </a>
            <a
              href="#register"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-xl bg-btn-ctaBg py-3 text-center text-base font-bold text-btn-ctaText shadow-sm hover:bg-btn-ctaBgHover"
            >
              Записатись
            </a>
          </div>
        </div>
      )}
    </header>
  );
}