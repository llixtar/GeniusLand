import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import Teachers from "@/components/Teachers";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Benefits from "@/components/Benefits";
import { Reviews } from "@/components/Reviews";
export default function Home() {
  return (
    /* w-full — на мобільних на весь екран
      lg:max-w-7xl — на компах обмежуємо ширину стрічки (1280px)
      lg:mx-auto — центруємо
      lg:mt-8 — додаємо фізичний відступ зверху, щоб сторінка висіла в повітрі
      lg:rounded-t-2xl — заокруглюємо верхні кути сторінки
      
      СУПЕР-3D ЕФЕКТ:
      lg:border lg:border-white/40 — додаємо ефектний відблиск по краях
      lg:shadow-[0_45px_100px_10px_rgba(0,0,0,0.25)] — кастомна мега-глибока тінь
      
      bg-bg-main — сама стрічка фарбується в наш кремовий колір
    */
    <div className="min-h-screen w-full lg:max-w-7xl lg:mx-auto lg:mt-8 lg:rounded-t-2xl lg:border lg:border-white/40 lg:shadow-[0_45px_100px_10px_rgba(0,0,0,0.25)] bg-bg-main text-text-body flex flex-col overflow-hidden">
      {/* Шапка сайту (всередині стрічки) */}
      <Header />

      {/* Головний контент */}
      <main className="flex-1">
        <Hero />
        <Courses />
        <Pricing />
        <Teachers />
        <Benefits />
        <Gallery />
        <Reviews />
        <ContactForm />

        {/* Наступні блоки будуть додаватися сюди */}
      </main>
      <Footer />
    </div>
  );
}