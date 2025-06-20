import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, SlidersHorizontal, Info, Sparkles, RotateCcw
} from 'lucide-react';

// Type definitions
export interface ImageFile {
  _id: string;
  url: string;
  title?: string;
  description?: string;
  filename?: string;
}

interface CreativeImageViewerProps {
  images: ImageFile[];
  startIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveImageDetails?: (imageId: string, title: string, description: string) => Promise<void>;
}

const GlassButton = ({ onClick, children, className = '' }: { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode; className?: string }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

const initialFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
};

const FilterSlider = ({ name, value, onChange, min, max, label }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-white/70 mb-1 capitalize">{label || name}</label>
    <div className="flex items-center space-x-3">
      <input
        id={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
      />
      <span className="text-xs font-mono w-8 text-center">{value}</span>
    </div>
  </div>
);

// Main Component
const CreativeImageViewer: React.FC<CreativeImageViewerProps> = ({ images, startIndex = 0, isOpen, onClose, onSaveImageDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [activePanel, setActivePanel] = useState<'details' | 'adjustments' | 'suggestions' | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const imageId = useMemo(() => images[currentIndex]?._id, [images, currentIndex]);
  const imageUrl = useMemo(() => images[currentIndex]?.url, [images, currentIndex]);

  const handleActivity = useCallback(() => {
    if (!isUiVisible) setIsUiVisible(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setIsUiVisible(false), 3000);
  }, [isUiVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setCurrentIndex(startIndex);
      setZoomLevel(1);
      setActivePanel(null);
      setFilters(initialFilters);
      document.body.style.overflow = 'hidden';
      handleActivity();
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, startIndex, handleActivity]);

  useEffect(() => {
    if (images[currentIndex]) {
      setCurrentTitle(images[currentIndex].title || '');
      setCurrentDescription(images[currentIndex].description || '');
    }
    setFilters(initialFilters); // Reset filters on image change
  }, [currentIndex, images]);

  const navigate = (dir: 'next' | 'prev') => {
    if (!isOpen) return;
    const newIndex = dir === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setZoomLevel(1);
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !activePanel) {
      onClose();
    }
  };

  const handleSaveDetails = () => {
    if (onSaveImageDetails && imageId) {
      onSaveImageDetails(imageId, currentTitle, currentDescription);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const filename = images[currentIndex]?.filename || `download.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageUrl, '_blank');
    }
  }, [imageUrl, currentIndex, images]);

  const togglePanel = (panel: 'details' | 'adjustments' | 'suggestions') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(f => ({ ...f, [filterName]: Number(e.target.value) }));
  };

  const imageStyle = useMemo(() => ({
    scale: zoomLevel,
    filter: `
      brightness(${filters.brightness / 100})
      contrast(${filters.contrast / 100})
      saturate(${filters.saturate / 100})
      sepia(${filters.sepia / 100})
      grayscale(${filters.grayscale / 100})
    `,
  }), [zoomLevel, filters]);

  const aiSuggestions = useMemo(() => ({
    titles: [
      'Sunset Over the Mountains',
      'Golden Hour Peaks',
      'Alpine Glow',
    ],
    descriptions: [
      'A breathtaking view of the sun setting behind the serene mountain range, casting a warm, golden light across the landscape.',
      'The last rays of sunlight paint the sky with vibrant colors, reflecting off the tranquil lake below the rugged peaks.',
      'Capturing the magical moment of twilight in the wilderness, where nature\'s beauty is on full display.',
    ],
  }), [currentIndex]); // Re-memoize if you want suggestions to change per image

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{ x: activePanel ? '-12rem' : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={imageUrl}
                alt={images[currentIndex]?.title || 'Displayed image'}
                style={imageStyle}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl select-none"
                onDoubleClick={() => setZoomLevel(z => z > 1 ? 1 : 2)}
              />
            </AnimatePresence>
          </motion.div>

          {/* UI Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isUiVisible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-5 right-5 pointer-events-auto">
              <GlassButton onClick={onClose}><X size={24} /></GlassButton>
            </div>

            {images.length > 1 && (
              <>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-auto">
                  <GlassButton onClick={() => navigate('prev')}><ChevronLeft size={32} /></GlassButton>
                </div>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-auto">
                  <GlassButton onClick={() => navigate('next')}><ChevronRight size={32} /></GlassButton>
                </div>
              </>
            )}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center space-x-2 p-2 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
                <GlassButton onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.2))}><ZoomOut size={20} /></GlassButton>
                <span className="text-white text-sm font-medium w-12 text-center select-none">{(zoomLevel * 100).toFixed(0)}%</span>
                <GlassButton onClick={() => setZoomLevel(z => Math.min(z + 0.2, 5))}><ZoomIn size={20} /></GlassButton>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <GlassButton onClick={() => togglePanel('adjustments')}><SlidersHorizontal size={20} /></GlassButton>
                <GlassButton onClick={() => togglePanel('details')}><Info size={20} /></GlassButton>
                <GlassButton onClick={() => togglePanel('suggestions')}><Sparkles size={20} /></GlassButton>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <GlassButton onClick={handleDownload}><Download size={20} /></GlassButton>
              </div>
            </div>
          </motion.div>

          {/* Side Panels */}
          <AnimatePresence>
            {activePanel && (
              <motion.div
                key={activePanel} // Ensure re-render on panel change
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="absolute top-0 right-0 h-full w-96 bg-black/20 backdrop-blur-xl border-l border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {activePanel === 'details' && (
                  <div className="p-6 text-white h-full flex flex-col">
                    <div className="flex-shrink-0 flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Details</h3>
                      <GlassButton onClick={() => setActivePanel(null)}><X size={20} /></GlassButton>
                    </div>
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-1">Title</label>
                        <input id="title" type="text" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} onBlur={handleSaveDetails} className="w-full bg-white/10 rounded-lg px-3 py-2 border border-transparent focus:border-white/30 focus:ring-0 outline-none transition" placeholder="Add a title" />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-1">Description</label>
                        <textarea id="description" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} onBlur={handleSaveDetails} rows={5} className="w-full bg-white/10 rounded-lg px-3 py-2 border border-transparent focus:border-white/30 focus:ring-0 outline-none transition resize-none" placeholder="Add a description" />
                      </div>
                      <div>
                        <h4 className="block text-sm font-medium text-white/70 mb-2">Info</h4>
                        <div className="text-xs text-white/50 space-y-1">
                          <p><b>Filename:</b> {images[currentIndex]?.filename || 'N/A'}</p>
                          <p><b>ID:</b> {imageId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activePanel === 'adjustments' && (
                  <div className="p-6 text-white h-full flex flex-col">
                    <div className="flex-shrink-0 flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Adjustments</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setFilters(initialFilters)} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"><RotateCcw size={12}/> Reset</button>
                        <GlassButton onClick={() => setActivePanel(null)}><X size={20} /></GlassButton>
                      </div>
                    </div>
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <FilterSlider name="brightness" value={filters.brightness} onChange={handleFilterChange('brightness')} min={0} max={200} />
                      <FilterSlider name="contrast" value={filters.contrast} onChange={handleFilterChange('contrast')} min={0} max={200} />
                      <FilterSlider name="saturate" value={filters.saturate} onChange={handleFilterChange('saturate')} min={0} max={200} />
                      <FilterSlider name="sepia" value={filters.sepia} onChange={handleFilterChange('sepia')} min={0} max={100} />
                      <FilterSlider name="grayscale" value={filters.grayscale} onChange={handleFilterChange('grayscale')} min={0} max={100} />
                    </div>
                  </div>
                )}
                {activePanel === 'suggestions' && (
                  <div className="p-6 text-white h-full flex flex-col">
                    <div className="flex-shrink-0 flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">AI Suggestions</h3>
                      <GlassButton onClick={() => setActivePanel(null)}><X size={20} /></GlassButton>
                    </div>
                    <div className="flex-grow space-y-6 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <div>
                        <h4 className="font-semibold mb-2 text-white/80">Titles</h4>
                        <div className="space-y-2">
                          {aiSuggestions.titles.map((title, i) => (
                            <button key={i} onClick={() => setCurrentTitle(title)} className="w-full text-left p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">{title}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-white/80">Descriptions</h4>
                        <div className="space-y-2">
                          {aiSuggestions.descriptions.map((desc, i) => (
                            <button key={i} onClick={() => setCurrentDescription(desc)} className="w-full text-left p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">{desc}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreativeImageViewer;
