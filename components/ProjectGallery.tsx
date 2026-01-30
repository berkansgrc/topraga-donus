import React, { useState, useEffect, useRef } from 'react';
import { useProjectImages } from '../hooks/useData';
import { ProjectImage } from '../types';
import { 
  Loader2, Image as ImageIcon, ZoomIn, Palette, 
  GraduationCap, ChevronLeft, ChevronRight, Pause, Play 
} from 'lucide-react';

const ProjectGallery: React.FC = () => {
  const { images, loading } = useProjectImages();
  const [activeTab, setActiveTab] = useState<'poster' | 'project'>('poster');
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  
  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<any>(null);

  const filteredImages = images.filter(img => img.category === activeTab);

  // Tab değişince slider'ı başa sar
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
  }, [activeTab]);

  // Otomatik Oynatma Mantığı (3 Saniye)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!isPaused && filteredImages.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, filteredImages.length]);

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-text-primary mb-4">Proje Galerisi</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Öğrencilerimizin hazırladığı farkındalık afişleri ve projemizden kareler.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-background-surface p-1.5 rounded-pill border border-border shadow-soft">
          <button
            onClick={() => setActiveTab('poster')}
            className={`px-6 py-2.5 rounded-pill font-bold text-sm flex items-center space-x-2 transition-all
              ${activeTab === 'poster' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-text-secondary hover:bg-background-base'}`}
          >
            <Palette size={18} />
            <span>Öğrenci Afişleri</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-6 py-2.5 rounded-pill font-bold text-sm flex items-center space-x-2 transition-all
              ${activeTab === 'project' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-text-secondary hover:bg-background-base'}`}
          >
            <GraduationCap size={18} />
            <span>Proje Resimleri</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-20 bg-background-subtle rounded-card border border-dashed border-border">
          <div className="bg-white p-4 rounded-full shadow-soft inline-block mb-4">
             <ImageIcon className="text-text-muted" size={32} />
          </div>
          <p className="text-text-secondary font-medium">Bu kategoride henüz görsel bulunmuyor.</p>
        </div>
      ) : (
        /* Slider Container */
        <div 
          className="relative w-full max-w-5xl mx-auto group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Window */}
          <div className="overflow-hidden rounded-2xl shadow-2xl border border-border bg-background-surface aspect-[16/9] md:aspect-[21/9] relative">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredImages.map((img) => (
                <div 
                  key={img.id} 
                  className="w-full h-full flex-shrink-0 relative cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  {/* Background Blur Effect for Portrait Images */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
                    style={{ backgroundImage: `url(${img.imageUrl})` }}
                  />
                  
                  {/* Actual Image */}
                  <div className="relative h-full w-full flex items-center justify-center backdrop-blur-sm bg-black/10">
                    <img 
                      src={img.imageUrl} 
                      alt={img.title}
                      className="max-h-full max-w-full object-contain shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Görsel+Yüklenemedi';
                      }}
                    />
                  </div>

                  {/* Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 text-white">
                    <div className="max-w-3xl mx-auto">
                      <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block
                        ${img.category === 'poster' ? 'bg-purple-500/80' : 'bg-blue-500/80'}
                      `}>
                        {img.category === 'poster' ? 'Afiş Çalışması' : 'Etkinlik'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold truncate">{img.title}</h3>
                      <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                        <ZoomIn size={16} className="mr-2" />
                        <span>Büyütmek için tıkla</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 hover:bg-white/90 text-white hover:text-text-primary p-3 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 hover:bg-white/90 text-white hover:text-text-primary p-3 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight size={24} />
          </button>

          {/* Controls / Indicators */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                {currentIndex + 1} / {filteredImages.length}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-1.5 rounded-full border border-white/10 transition-colors"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {filteredImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full 
                  ${idx === currentIndex 
                    ? 'w-8 h-2.5 bg-primary' 
                    : 'w-2.5 h-2.5 bg-border hover:bg-primary/50'}`}
              />
            ))}
          </div>

          {/* Progress Bar (Visual Timer) */}
          {!isPaused && filteredImages.length > 1 && (
             <div className="absolute bottom-0 left-0 h-1 bg-primary z-20 transition-all duration-100 ease-linear w-full animate-progress origin-left"></div>
          )}
        </div>
      )}

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
               onClick={() => setSelectedImage(null)}
               className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center group"
             >
               <span className="mr-3 font-medium text-lg group-hover:mr-4 transition-all">Kapat</span>
               <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 border border-white/10">
                 <X size={24} className="text-white" />
               </div>
             </button>

             <img 
               src={selectedImage.imageUrl} 
               alt={selectedImage.title} 
               className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain bg-black border border-white/10"
             />
             
             <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-8 py-5 mt-6 shadow-xl max-w-2xl text-center text-white">
               <h3 className="font-bold text-2xl mb-1">{selectedImage.title}</h3>
               <p className="text-white/60 text-sm">{selectedImage.category === 'poster' ? 'Öğrenci Afiş Çalışması' : 'Proje Etkinliği'}</p>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Helper icon
function X({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default ProjectGallery;