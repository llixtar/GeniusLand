"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { articles as fallbackArticles } from "@/data/articles";
import { Calendar, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setArticles(data);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen w-full lg:max-w-7xl lg:mx-auto lg:mt-8 lg:rounded-t-2xl lg:border lg:border-white/40 lg:shadow-[0_45px_100px_10px_rgba(0,0,0,0.25)] bg-bg-main text-text-body flex flex-col overflow-hidden">
      {/* Шапка сайту */}
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Кнопка повернення на сайт */}
          <div className="mb-8 flex justify-start">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all uppercase tracking-wider cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 stroke-[3]" />
              Повернутися на головну
            </Link>
          </div>

          {/* Бруталістичний заголовок */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-black tracking-tight text-text-title sm:text-4xl uppercase">
              Корисна інформація
            </h1>
            <p className="text-xs font-black text-text-muted uppercase tracking-widest mt-2.5">
              Бібліотека для батьків: досвід та корисні поради
            </p>
            <div className="mt-3 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
          </div>

          {/* Індикатор завантаження бази даних */}
          {loading && (
            <div className="mb-6 flex justify-center items-center gap-2 text-xs font-bold text-slate-500 bg-white border-2 border-black rounded-xl px-4 py-2 w-max mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-secondary" />
              <span>Оновлення статей з бази даних...</span>
            </div>
          )}

          {/* Список статей */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {articles.map((article) => (
              <article 
                key={article.slug}
                className="group flex flex-col justify-between rounded-3xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150"
              >
                <div>
                  {/* Мета дані */}
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                    <span className="bg-brand-secondary/15 border border-black rounded-lg px-2.5 py-0.5 text-text-title font-black text-[9px] uppercase tracking-wider">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 font-bold">
                      <Calendar className="h-3.5 w-3.5 text-brand-secondary" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  {/* Назва та прев'ю */}
                  <h2 className="text-lg font-black text-text-title leading-snug uppercase tracking-tight group-hover:text-brand-secondary transition-colors">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-xs font-bold text-text-body leading-relaxed mt-3">
                    {article.description}
                  </p>
                </div>

                {/* Посилання на повну статтю */}
                <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-end">
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black bg-btn-ctaBg px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-75 whitespace-nowrap"
                  >
                    Читати статтю <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      {/* Підвал сайту */}
      <Footer />
    </div>
  );
}