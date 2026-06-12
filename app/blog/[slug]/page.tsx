"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";
import { Calendar, ChevronLeft } from "lucide-react";
import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full lg:max-w-7xl lg:mx-auto lg:mt-8 lg:rounded-t-2xl lg:border lg:border-white/40 lg:shadow-[0_45px_100px_10px_rgba(0,0,0,0.25)] bg-bg-main text-text-body flex flex-col overflow-hidden">
      {/* Шапка сайту */}
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          
          {/* Кнопка назад */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all uppercase tracking-wider cursor-pointer mb-8 group"
          >
            <ChevronLeft className="h-4 w-4 stroke-[3] transition-transform group-hover:-translate-x-0.5" />
            Назад до корисної інформації
          </Link>

          {/* Шапка статті */}
          <header className="mb-10">
            <span className="bg-brand-secondary/15 text-text-title border border-black rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-title mt-4 leading-tight uppercase">
              {article.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted mt-4">
              <Calendar className="h-4 w-4 text-brand-secondary" />
              <span>{article.date}</span>
            </div>
            <div className="mt-6 h-[1.5px] w-full bg-black/10" />
          </header>

          {/* Тіло статті - бруталістичний контейнер-картка */}
          <div className="prose prose-slate max-w-none text-text-body text-sm sm:text-base leading-relaxed space-y-5 font-semibold bg-white border-2 border-black p-6 sm:p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Декоративний футер статті */}
          <div className="mt-12 pt-6 border-t-2 border-black/10 text-center">
            <p className="text-xs text-text-muted font-black uppercase tracking-tight">
              Дякуємо, що читаєте GeniusLand. Маєте питання? Запишіться на безкоштовне пробне заняття!
            </p>
            <Link 
              href="/#prices"
              className="inline-block mt-4 rounded-xl border-2 border-black bg-btn-ctaBg px-5 py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all"
            >
              Переглянути абонементи
            </Link>
          </div>

        </div>
      </main>

      {/* Підвал сайту */}
      <Footer />
    </div>
  );
}