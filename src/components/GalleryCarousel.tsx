'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  ArrowUp,
  ArrowDown,
  Shuffle,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ArtPiece {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface ArtGalleryCarouselProps {
  artPieces: ArtPiece[];
}

export default function ArtGalleryCarousel({ artPieces }: ArtGalleryCarouselProps) {
  const [mainViewRef, mainCarouselApi] = useEmblaCarousel({
    loop: true,
    duration: 20, // Smoother transition duration
  });
  const [thumbViewRef, thumbCarouselApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [preloadIndexes, setPreloadIndexes] = useState<number[]>([0, 1]);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest' | 'random'>('recent');
  const [sortedArtPieces, setSortedArtPieces] = useState<ArtPiece[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Sorting functions
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Sort paintings based on selected order
  useEffect(() => {
    let sorted: ArtPiece[] = [];

    switch (sortOrder) {
      case 'recent':
        sorted = [...artPieces].sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        sorted = [...artPieces].sort((a, b) => a.id - b.id);
        break;
      case 'random':
        sorted = shuffleArray(artPieces);
        break;
    }

    setSortedArtPieces(sorted);
  }, [artPieces, sortOrder, shuffleArray]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainCarouselApi || !thumbCarouselApi) return;
      mainCarouselApi.scrollTo(index);
    },
    [mainCarouselApi, thumbCarouselApi]
  );

  const onSelect = useCallback(() => {
    if (!mainCarouselApi || !thumbCarouselApi) return;
    const currentIndex = mainCarouselApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
    thumbCarouselApi.scrollTo(currentIndex);

    // Update preload indexes
    const prevIndex = currentIndex === 0 ? sortedArtPieces.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === sortedArtPieces.length - 1 ? 0 : currentIndex + 1;
    setPreloadIndexes([prevIndex, currentIndex, nextIndex]);
  }, [mainCarouselApi, thumbCarouselApi, sortedArtPieces.length]);

  useEffect(() => {
    if (!mainCarouselApi) return;

    onSelect();
    mainCarouselApi.on('select', onSelect);
    mainCarouselApi.on('reInit', onSelect);

    return () => {
      mainCarouselApi.off('select', onSelect);
      mainCarouselApi.off('reInit', onSelect);
    };
  }, [mainCarouselApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (mainCarouselApi) mainCarouselApi.scrollPrev();
  }, [mainCarouselApi]);

  const scrollNext = useCallback(() => {
    if (mainCarouselApi) mainCarouselApi.scrollNext();
  }, [mainCarouselApi]);

  // Navigation in zoom mode
  const navigateInZoom = useCallback(
    (direction: 'prev' | 'next') => {
      // Start transition
      setIsTransitioning(true);
      
      setTimeout(() => {
        let newIndex: number;
        if (direction === 'prev') {
          newIndex = selectedIndex === 0 ? sortedArtPieces.length - 1 : selectedIndex - 1;
        } else {
          newIndex = selectedIndex === sortedArtPieces.length - 1 ? 0 : selectedIndex + 1;
        }

        setSelectedIndex(newIndex);
        if (mainCarouselApi) {
          mainCarouselApi.scrollTo(newIndex);
        }

        // Reset zoom when changing images
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
        
        // End transition after a short delay
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300); // Wait for fade out before changing image
    },
    [selectedIndex, sortedArtPieces.length, mainCarouselApi]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (zoomModalOpen) {
          navigateInZoom('prev');
        } else {
          scrollPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (zoomModalOpen) {
          navigateInZoom('next');
        } else {
          scrollNext();
        }
      } else if (e.key === 'Escape' && zoomModalOpen) {
        setZoomModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext, zoomModalOpen, navigateInZoom]);

  // Auto-hide swipe indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const handleZoomReset = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const openZoomModal = (index: number) => {
    setSelectedIndex(index);
    setZoomModalOpen(true);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Scroll wheel zoom
  useEffect(() => {
    if (!zoomModalOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(1, Math.min(3, prev + delta)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomModalOpen]);

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      setPanPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="space-y-4">
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900">
        <div className="relative w-full" ref={mainViewRef}>
          <div className="flex transition-transform duration-300 ease-out">
            {sortedArtPieces.map((art, index) => (
              <div key={art.id} className="relative flex-[0_0_100%] min-w-0">
                <div className="relative w-full flex justify-center items-center bg-neutral-50 dark:bg-slate-900 transition-opacity duration-300">
                  {/* Container that adapts to image orientation */}
                  <div className="relative w-full max-w-4xl mx-auto p-4 md:p-8">
                    <div
                      className="relative w-full cursor-zoom-in"
                      style={{ aspectRatio: '3/4', maxHeight: '80vh' }}
                      onClick={() => openZoomModal(index)}
                    >
                      <Image
                        src={art.image || '/placeholder.svg'}
                        alt={art.title}
                        fill
                        priority={preloadIndexes.includes(index)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
                        className="object-contain transition-opacity duration-300"
                        quality={95}
                      />
                    </div>
                    {/* Image information below the artwork */}
                    <div className="mt-4 text-center">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {art.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                        {art.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - replaced shadcn Button with custom Tailwind buttons */}
        <button
          className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 md:h-10 md:w-10"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
          <VisuallyHidden.Root>Previous</VisuallyHidden.Root>
        </button>
        <button
          className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 md:h-10 md:w-10"
          onClick={scrollNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
          <VisuallyHidden.Root>Next</VisuallyHidden.Root>
        </button>

        {/* Swipe Indicator */}
        {showSwipeIndicator && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="bg-black/50 text-white px-6 py-3 rounded-full flex items-center gap-4 animate-pulse">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-sm font-medium">Swipe to navigate</span>
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail carousel */}
      <div className="overflow-hidden" ref={thumbViewRef}>
        <div className="flex gap-2 md:gap-4 py-2">
          {sortedArtPieces.map((art, index) => (
            <button
              key={art.id}
              onClick={() => onThumbClick(index)}
              className={`relative flex-[0_0_16%] md:flex-[0_0_12%] lg:flex-[0_0_10%] min-w-0 cursor-pointer overflow-hidden rounded-md transition-all ${
                index === selectedIndex
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'ring-0 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View ${art.title}`}
              aria-pressed={index === selectedIndex}
            >
              <div className="relative aspect-[3/4] bg-gray-100 dark:bg-slate-800">
                <Image
                  src={art.image || '/placeholder.svg'}
                  alt={`Thumbnail for ${art.title}`}
                  fill
                  sizes="(max-width: 640px) 16vw, (max-width: 1024px) 12vw, 10vw"
                  className="object-contain p-1"
                  quality={80}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomModalOpen && sortedArtPieces[selectedIndex] && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" style={{ margin: 0, top: 0 }}>
          <div
            ref={zoomContainerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomReset}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm flex items-center">
                {Math.round(zoomLevel * 100)}%
              </div>
              <button
                onClick={() => setZoomModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors ml-4"
                aria-label="Close zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation in Zoom Mode */}
            <button
              onClick={e => {
                e.stopPropagation();
                navigateInZoom('prev');
              }}
              onMouseDown={e => e.stopPropagation()}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                navigateInZoom('next');
              }}
              onMouseDown={e => e.stopPropagation()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Sorting Controls in Zoom Mode */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => setSortOrder('recent')}
                className={`p-2 rounded-lg transition-colors ${
                  sortOrder === 'recent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label="Sort by most recent"
                title="Most recent first"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`p-2 rounded-lg transition-colors ${
                  sortOrder === 'oldest'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label="Sort by oldest"
                title="Oldest first"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSortOrder('random')}
                className={`p-2 rounded-lg transition-colors ${
                  sortOrder === 'random'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label="Shuffle"
                title="Random order"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 text-white/70 text-sm space-y-1">
              <p className="flex items-center gap-2">
                <Move className="w-4 h-4" />
                Click and drag to pan
              </p>
              <p>Use scroll wheel to zoom</p>
              <p>Press ESC to close</p>
            </div>

            {/* Zoomed Image */}
            <div
              className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
              } ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? 'transform 0.2s ease-out' : 'transform 0.2s ease-out, opacity 0.3s ease-in-out',
              }}
            >
              <Image
                src={sortedArtPieces[selectedIndex].image || '/placeholder.svg'}
                alt={sortedArtPieces[selectedIndex].title}
                width={1920}
                height={1920}
                className="object-contain max-w-full max-h-full"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
