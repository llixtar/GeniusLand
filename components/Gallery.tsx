"use client";

import Image from "next/image";

export default function Gallery() {
  // Набір тематичних фото (діти, навчання, атмосфера)
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=450",
      alt: "Заняття в класі",
      span: "col-span-2 row-span-2", // Велике фото (2х2), але не на всю ширину
    },
    {
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500&h=500",
      alt: "Вивчення англійської",
      span: "col-span-1 row-span-1", // Наймаленька плитка (1х1)
    },
    {
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=500&h=650",
      alt: "Творчий процес",
      span: "col-span-1 row-span-2", // Вертикальна плитка (1х2)
    },
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=500&h=380",
      alt: "Щасливі діти",
      span: "col-span-2 row-span-1", // Горизонтальна плитка (2х1)
    },
    {
      url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=500&h=380",
      alt: "Розвиток логіки",
      span: "col-span-1 row-span-1", // Наймаленька плитка (1х1)
    },
    {
      url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=600&h=400",
      alt: "Урок математики",
      span: "col-span-2 row-span-1", // Горизонтальна плитка (2х1)
    },
  ];

  return (
    <section id="gallery" className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок блоку */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-black tracking-tight text-text-title sm:text-3xl uppercase">
            Життя нашої школи
          </h2>
          <div className="mt-2 h-1 w-16 bg-brand-logoName mx-auto rounded-full" />
          <p className="mt-3 text-sm font-medium text-text-muted">
            Подивіться, як проходять наші заняття та в якій атмосфері навчаються діти
          </p>
        </div>

        {/* АСИМЕТРИЧНА МОЗАЇКА (Grid Masonry) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-6xl mx-auto auto-rows-[90px] min-[400px]:auto-rows-[110px] sm:auto-rows-[200px] md:auto-rows-[220px]">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`animate-fade-in-up group relative rounded-3xl overflow-hidden border border-slate-300/40 bg-white p-2 transition-all duration-300 hover:border-text-title opacity-0 ${photo.span}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              {/* Внутрішній контейнер для фото з м'якими кутами */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-50">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(max-w-7xl) 33vw, 50vw"
                  className="object-cover opacity-0 transition-transform duration-700 ease-out group-hover:scale-102"
                  onLoadingComplete={(img) => img.classList.remove("opacity-0")}
                />
                
                {/* Легкий оверлей при ховері для преміального ефекту */}
                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}