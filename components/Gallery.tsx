"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DBPhoto {
  id: string;
  url: string;
}

interface PhotoWithLayout extends DBPhoto {
  isVertical: boolean;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<DBPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const [columnsData, setColumnsData] = useState<PhotoWithLayout[][]>([[], [], []]);
  const initialPatternsRef = useRef<string[][]>([]);
  const galleryRef = useRef<HTMLElement>(null);

  // Swipe refs for mobile (using refs instead of state to prevent re-renders during swiping)
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

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

  // Initialize and persist the random pattern for the first 3 columns
  useEffect(() => {
    if (photos.length > 0 && initialPatternsRef.current.length === 0) {
      const colTypes = [
        ["S", "V"],     // 1 square, 1 vertical
        ["V", "S"],     // 1 vertical, 1 square
        ["S", "S", "S"], // 3 squares
      ];
      // Randomly select configuration for each of the 3 columns
      initialPatternsRef.current = [
        colTypes[Math.floor(Math.random() * colTypes.length)],
        colTypes[Math.floor(Math.random() * colTypes.length)],
        colTypes[Math.floor(Math.random() * colTypes.length)],
      ];
    }
  }, [photos]);

  // Distribute photos into columns dynamically based on state and pattern
  useEffect(() => {
    if (photos.length === 0 || initialPatternsRef.current.length === 0) return;

    const patterns = initialPatternsRef.current;
    const col1: PhotoWithLayout[] = [];
    const col2: PhotoWithLayout[] = [];
    const col3: PhotoWithLayout[] = [];
    const cols = [col1, col2, col3];

    let photoIndex = 0;

    // First, fill the top layout (visible when showAll is false)
    for (let c = 0; c < 3; c++) {
      const pattern = patterns[c];
      for (let p = 0; p < pattern.length; p++) {
        if (photoIndex < photos.length) {
          cols[c].push({
            ...photos[photoIndex],
            isVertical: pattern[p] === "V",
          });
          photoIndex++;
        }
      }
    }

    // If showAll is active, distribute the rest of the photos round-robin
    if (showAll) {
      const restPattern = ["S", "V", "S", "S", "V"];
      let restIndex = 0;
      while (photoIndex < photos.length) {
        const colTarget = photoIndex % 3;
        const isVertical = restPattern[restIndex % restPattern.length] === "V";
        cols[colTarget].push({
          ...photos[photoIndex],
          isVertical,
        });
        photoIndex++;
        restIndex++;
      }
    }

    setColumnsData(cols);
  }, [photos, showAll]);

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

  // Preload adjacent images for smooth swiping/transitions on mobile
  useEffect(() => {
    if (activePhotoIndex === null || photos.length <= 1) return;

    const nextIndex = (activePhotoIndex + 1) % photos.length;
    const prevIndex = (activePhotoIndex - 1 + photos.length) % photos.length;

    const nextImg = new window.Image();
    nextImg.src = photos[nextIndex].url;

    const prevImg = new window.Image();
    prevImg.src = photos[prevIndex].url;
  }, [activePhotoIndex, photos]);

  // Swipe handlers for mobile (using refs to prevent continuous re-rendering on touchmove)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      handleNext(); // Swipe left -> next image
    } else if (swipeDistance < -minSwipeDistance) {
      handlePrev(); // Swipe right -> previous image
    }
  };

  const handleToggleShowAll = () => {
    if (showAll) {
      setShowAll(false);
      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      setShowAll(true);
    }
  };

  // Gracefully hide the section if there are no photos uploaded yet
  if (loading || photos.length === 0) {
    return null;
  }

  return (
    <section id="gallery" ref={galleryRef} className="relative bg-transparent pt-16 pb-24 border-t border-black/5">
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

        {/* АСИМЕТРИЧНА МОЗАЇКА (3 окремі вертикальні колонки для бездоганного вирівнювання) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-6xl mx-auto items-start">
          {columnsData.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-2 sm:gap-4">
              {column.map((photo, photoIdx) => {
                const globalIndex = photos.findIndex((p) => p.id === photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(globalIndex !== -1 ? globalIndex : 0)}
                    className={`animate-fade-in-up group relative rounded-2xl overflow-hidden border border-black bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none opacity-0 cursor-pointer w-full ${
                      photo.isVertical 
                        ? 'h-[188px] min-[400px]:h-[220px] sm:h-[400px] md:h-[496px]' 
                        : 'h-[90px] min-[400px]:h-[106px] sm:h-[192px] md:h-[240px]'
                    }`}
                    style={{ 
                      animationDelay: `${(colIdx + photoIdx * 3) * 80}ms`,
                      animationFillMode: 'forwards' 
                    }}
                  >
                    <Image
                      src={photo.url}
                      alt="Фото заняття в школі розвитку GeniusLand Хотин"
                      fill
                      sizes="(max-w-7xl) 33vw, 50vw"
                      priority={globalIndex < 3}
                      loading={globalIndex < 3 ? undefined : "lazy"}
                      className="object-cover opacity-0 transition-transform duration-700 ease-out group-hover:scale-102"
                      onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                    />
                    
                    {/* Легкий оверлей при ховері для преміального ефекту */}
                    <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* TOGGLE VIEW BUTTON */}
        {photos.length > (initialPatternsRef.current[0]?.length + initialPatternsRef.current[1]?.length + initialPatternsRef.current[2]?.length || 6) && (
          <div className="mt-12 text-center">
            <button
              onClick={handleToggleShowAll}
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
            className="relative max-w-5xl max-h-[85vh] w-full px-4 flex items-center justify-center select-none touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={activePhotoIndex}
              src={photos[activePhotoIndex].url}
              alt="Збільшене фото заняття GeniusLand Хотин"
              decoding="async"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-fade-in-quick"
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
