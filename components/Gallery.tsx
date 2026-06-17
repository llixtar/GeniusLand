"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DBPhoto {
  id: string;
  url: string;
}

const SPANS = [
  "col-span-2 row-span-2", // Large 2x2
  "col-span-1 row-span-1", // Small 1x1
  "col-span-1 row-span-2", // Vertical 1x2
  "col-span-2 row-span-1", // Horizontal 2x1
  "col-span-1 row-span-1", // Small 1x1
  "col-span-2 row-span-1", // Horizontal 2x1
];

export default function Gallery() {
  const [photos, setPhotos] = useState<DBPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Swipe states for mobile
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, url")
          .order("created_at", { ascending: false })
          .limit(36); // Fetch a larger set (divisible by 6 and 3)

        if (error) throw error;
        setPhotos(data || []);
      } catch (err) {
        console.error("Error loading gallery photos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, []);

  // Prevent scroll when Lightbox is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePhotoIndex]);

  // Keyboard navigation for Lightbox
  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
  };

  useEffect(() => {
    if (activePhotoIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, photos]);

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      handleNext(); // Swipe left -> next image
    } else if (swipeDistance < -minSwipeDistance) {
      handlePrev(); // Swipe right -> previous image
    }
  };

  // Gracefully hide the section if there are no photos uploaded yet
  if (loading || photos.length === 0) {
    return null;
  }

  const displayedPhotos = showAll ? photos : photos.slice(0, 6);

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
          {displayedPhotos.map((photo, index) => {
            const span = SPANS[index % SPANS.length];
            return (
              <div
                key={photo.id}
                onClick={() => setActivePhotoIndex(index)}
                className={`animate-fade-in-up group relative rounded-3xl overflow-hidden border border-slate-300/40 bg-white p-2 transition-all duration-300 hover:border-text-title opacity-0 cursor-pointer ${span}`}
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: 'forwards' 
                }}
              >
                {/* Внутрішній контейнер для фото з м'якими кутами */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-50">
                  <Image
                    src={photo.url}
                    alt="Фото з життя школи"
                    fill
                    sizes="(max-w-7xl) 33vw, 50vw"
                    priority={index < 3} // Preload the first 3 images immediately to improve LCP
                    loading={index < 3 ? undefined : "lazy"} // Lazy load the rest
                    className="object-cover opacity-0 transition-transform duration-700 ease-out group-hover:scale-102"
                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                  />
                  
                  {/* Легкий оверлей при ховері для преміального ефекту */}
                  <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* TOGGLE VIEW BUTTON */}
        {photos.length > 6 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:shadow-none transition-all cursor-pointer select-none"
            >
              {showAll ? (
                <>
                  <span>Згорнути</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Переглянути всі</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activePhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 z-[110] p-2.5 rounded-full border-2 border-black bg-[#facc15] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            aria-label="Закрити"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Arrow (Desktop Only) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 z-[110] p-3 rounded-full border-2 border-black bg-white text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer md:flex hidden"
            aria-label="Попереднє фото"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Lightbox Content Area */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full px-4 flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={photos[activePhotoIndex].url}
              alt="Перегляд фото"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Slider Counter */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/75 border border-white/10 text-white text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
              {activePhotoIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Right Arrow (Desktop Only) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 z-[110] p-3 rounded-full border-2 border-black bg-white text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer md:flex hidden"
            aria-label="Наступне фото"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

    </section>
  );
}
