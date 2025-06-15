import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Type definitions
export interface ImageFile {
  _id: string;
  url: string;
  title?: string;
  description?: string;
  filename?: string;
}

interface FiltersState {
  brightness: number;
  contrast: number;
  grayscale: number;
  sepia: number;
  saturate: number;
  hueRotate: number;
  blur: number;
}

interface CreativeImageViewerProps {
  images: ImageFile[];
  startIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveImageDetails?: (imageId: string, title: string, description: string) => Promise<void>;
}

interface AiSuggestion {
  name: string;
  filters: Partial<FiltersState>;
}

// Initial state constants
const initialFilters: FiltersState = {
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  sepia: 0,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
};

const aiSuggestions: AiSuggestion[] = [
  { name: 'Vintage', filters: { sepia: 70, brightness: 90, contrast: 110, saturate: 80 } },
  { name: 'Cool Blue', filters: { hueRotate: 200, saturate: 130, brightness: 105 } },
  { name: 'Warm Glow', filters: { sepia: 30, saturate: 120, brightness: 110 } },
  { name: 'MonoChrome', filters: { grayscale: 100, contrast: 120 } },
];

// Main Component
const CreativeImageViewer: React.FC<CreativeImageViewerProps> = ({
  images,
  startIndex = 0,
  isOpen,
  onClose,
  onSaveImageDetails,
}) => {
  // State management
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [isLoadingNewImage, setIsLoadingNewImage] = useState(false);
  const [activePanel, setActivePanel] = useState<'filters' | 'details' | 'ai' | null>(null);
  const [panelPosition, setPanelPosition] = useState<'hidden' | 'left' | 'right'>('hidden');
  const [isUiVisible, setIsUiVisible] = useState(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Memoized values
  const imageUrl = useMemo(() => images[currentIndex]?.url, [images, currentIndex]);
  const imageId = useMemo(() => images[currentIndex]?._id, [images, currentIndex]);

  // UI auto-hide logic
  const handleActivity = useCallback(() => {
    if (!isUiVisible) setIsUiVisible(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setIsUiVisible(false), 3000);
  }, [isUiVisible]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      setZoomLevel(1);
      setRotation(0);
      setFilters(initialFilters);
      setActivePanel(null);
      setPanelPosition('hidden');
      document.body.style.overflow = 'hidden';
      handleActivity();
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
    } else {
      document.body.style.overflow = 'auto';
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    }
    return () => {
      document.body.style.overflow = 'auto';
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isOpen, startIndex, handleActivity]);

  useEffect(() => {
    if (images[currentIndex]) {
      setCurrentTitle(images[currentIndex].title || '');
      setCurrentDescription(images[currentIndex].description || '');
    }
  }, [currentIndex, images]);

  // Event Handlers
  const handleImageLoad = () => setIsLoadingNewImage(false);

  const navigate = (dir: 'next' | 'prev') => {
    setIsLoadingNewImage(true);
    setDirection(dir === 'next' ? 1 : -1);
    const newIndex = dir === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleFilterChange = (filterName: keyof FiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: Number(value) }));
  };

  const resetImageTransforms = () => {
    setZoomLevel(1);
    setRotation(0);
    setFilters(initialFilters);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = images[currentIndex]?.filename || `image-${images[currentIndex]?._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePanel = (panel: 'filters' | 'details' | 'ai' | null, position?: 'left' | 'right') => {
    if (activePanel === panel && panelPosition !== 'hidden') {
      setPanelPosition('hidden');
      setActivePanel(null);
    } else {
      setActivePanel(panel);
      setPanelPosition(position || (panel === 'details' ? 'left' : 'right'));
    }
  };

  const applyAiSuggestion = (suggestion: AiSuggestion) => {
    setFilters(prev => ({ ...initialFilters, ...suggestion.filters }));
  };

  const imageStyle = useMemo(() => ({
    transform: `rotate(${rotation}deg) scale(${zoomLevel})`,
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg) blur(${filters.blur}px)`,
    transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
  }), [rotation, zoomLevel, filters]);

  // Animation Variants
  const imageTransitionVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 }),
  };
  
  const uiFadeVariants = {
    hidden: { opacity: 0, transition: { duration: 0.4 } },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  const sidePanelVariants = {
    hidden: (pos: 'left' | 'right') => ({ x: pos === 'left' ? '-100%' : '100%' }),
    visible: { x: '0%' },
    exit: (pos: 'left' | 'right') => ({ x: pos === 'left' ? '-100%' : '100%' }),
  };

  // Helper Components
  const ControlButton: React.FC<{
    Icon: React.ElementType;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
    isActive?: boolean;
  }> = ({ Icon, label, onClick, className = '', isActive = false }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center justify-center p-2 rounded-lg text-white/80 hover:text-white transition-colors space-y-1 text-xs ${isActive ? 'bg-indigo-500/50 text-white' : 'hover:bg-white/10'} ${className}`}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );

  // Panel Rendering Functions
  const renderFilterSlider = (name: keyof FiltersState, label: string, min: number, max: number, unit: string = '%') => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-xs font-medium text-gray-300">{label}: {filters[name]}{unit}</label>
      <input type="range" id={name} name={name} min={min} max={max} value={filters[name]} onChange={(e) => handleFilterChange(name, e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
    </div>
  );
  
  const renderMainControls = () => (
    <div className="max-w-xl mx-auto flex justify-around items-center space-x-1">
      <ControlButton Icon={AdjustmentsHorizontalIcon} label="Filters" onClick={(e) => {e.stopPropagation(); togglePanel('filters', 'right');}} isActive={activePanel === 'filters'} />
      <ControlButton Icon={MagnifyingGlassPlusIcon} label="Zoom In" onClick={(e) => {e.stopPropagation(); setZoomLevel(z => Math.min(z + 0.2, 3));}} />
      <ControlButton Icon={MagnifyingGlassMinusIcon} label="Zoom Out" onClick={(e) => {e.stopPropagation(); setZoomLevel(z => Math.max(z - 0.2, 0.5));}} />
      <ControlButton Icon={InformationCircleIcon} label="Details" onClick={(e) => {e.stopPropagation(); togglePanel('details', 'left');}} isActive={activePanel === 'details'} />
      <ControlButton Icon={SparklesIcon} label="AI" onClick={(e) => {e.stopPropagation(); togglePanel('ai', 'right');}} isActive={activePanel === 'ai'} />
      <ControlButton Icon={ArrowDownTrayIcon} label="Download" onClick={(e) => {e.stopPropagation(); handleDownload();}} />
      <ControlButton Icon={HeartIcon} label="Favorite" onClick={(e) => {e.stopPropagation(); console.log('Favorite clicked');}} />
      <ControlButton Icon={ShareIcon} label="Share" onClick={(e) => {e.stopPropagation(); console.log('Share clicked');}} />
      <ControlButton Icon={TrashIcon} label="Delete" onClick={(e) => {e.stopPropagation(); console.log('Delete clicked');}} className="text-red-400 hover:text-red-300" />
    </div>
  );

  const renderFiltersPanel = () => (
    <div className="flex flex-col h-full text-white pointer-events-auto" onClick={(e) => e.stopPropagation()}>
      <div className="p-4 border-b border-white/10 flex-shrink-0 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters & Transform</h3>
        <button onClick={() => togglePanel(null)} className="p-1.5 rounded-full hover:bg-white/15"><XMarkIcon className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/80 scrollbar-track-transparent">
        <div className="grid grid-cols-2 gap-3">
                        <ControlButton Icon={ArrowPathIcon} label="Rotate -90°" onClick={(e) => { e.stopPropagation(); setRotation(r => r - 90);}} className="w-full h-auto py-2 !text-xs bg-white/5" />
            <ControlButton Icon={ArrowUturnLeftIcon} label="Reset All" onClick={(e) => { e.stopPropagation(); resetImageTransforms();}} className="w-full h-auto py-2 !text-xs bg-white/5" />
        </div>
        {renderFilterSlider('brightness', 'Brightness', 0, 200)}
        {renderFilterSlider('contrast', 'Contrast', 0, 200)}
        {renderFilterSlider('saturate', 'Saturate', 0, 200)}
        {renderFilterSlider('grayscale', 'Grayscale', 0, 100)}
        {renderFilterSlider('sepia', 'Sepia', 0, 100)}
        {renderFilterSlider('hueRotate', 'Hue Rotate', 0, 360, 'deg')}
        {renderFilterSlider('blur', 'Blur', 0, 20, 'px')}
      </div>
    </div>
  );

  const renderDetailsPanel = () => (
    <div className="flex flex-col h-full text-white pointer-events-auto" onClick={(e) => e.stopPropagation()}>
      <div className="p-4 border-b border-white/10 flex-shrink-0 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Image Details</h3>
        <button onClick={() => togglePanel(null)} className="p-1.5 rounded-full hover:bg-white/15"><XMarkIcon className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/80 scrollbar-track-transparent">
        <div>
          <label htmlFor="imageTitle" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input type="text" id="imageTitle" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} onBlur={() => onSaveImageDetails && imageId && onSaveImageDetails(imageId, currentTitle, currentDescription)} className="block w-full bg-white/5 border-white/10 rounded-md py-2 px-3 text-sm text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter image title" />
        </div>
        <div>
          <label htmlFor="imageDescription" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea id="imageDescription" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} onBlur={() => onSaveImageDetails && imageId && onSaveImageDetails(imageId, currentTitle, currentDescription)} rows={4} className="block w-full bg-white/5 border-white/10 rounded-md py-2 px-3 text-sm text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 scrollbar-thin scrollbar-thumb-gray-500/70" placeholder="Enter image description" />
        </div>
        {imageUrl && <div><p className="block text-sm font-medium text-gray-300 mb-1">URL</p><a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs break-all">{imageUrl}</a></div>}
      </div>
    </div>
  );

  const renderAiPanel = () => (
    <div className="flex flex-col h-full text-white pointer-events-auto" onClick={(e) => e.stopPropagation()}>
      <div className="p-4 border-b border-white/10 flex-shrink-0 flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Suggestions</h3>
        <button onClick={() => togglePanel(null)} className="p-1.5 rounded-full hover:bg-white/15"><XMarkIcon className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/80 scrollbar-track-transparent">
        {aiSuggestions.map(suggestion => (
          <button key={suggestion.name} onClick={() => applyAiSuggestion(suggestion)} className="group relative w-full h-24 rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500">
            {imageUrl && <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${imageUrl})`, filter: `brightness(${suggestion.filters.brightness || 100}%) contrast(${suggestion.filters.contrast || 100}%) saturate(${suggestion.filters.saturate || 100}%) grayscale(${suggestion.filters.grayscale || 0}%) sepia(${suggestion.filters.sepia || 0}%) hue-rotate(${suggestion.filters.hueRotate || 0}deg)` }} />}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs font-medium truncate text-center">{suggestion.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Main Render
  if (!isOpen || !images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="viewer-container"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseMove={handleActivity}
          onMouseLeave={() => { if (inactivityTimer.current) { clearTimeout(inactivityTimer.current); setIsUiVisible(false); } }}
          onClick={(e) => { if (e.target === e.currentTarget && activePanel === null) onClose(); }}
        >
          <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Image Display */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={imageUrl}
                alt={images[currentIndex]?.title || 'Displayed image'}
                variants={imageTransitionVariants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="max-w-full max-h-full object-contain block shadow-2xl rounded-lg"
                style={imageStyle}
                onLoad={handleImageLoad}
                onError={() => setIsLoadingNewImage(false)}
              />
            </AnimatePresence>

            {/* UI Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              variants={uiFadeVariants}
              initial="visible"
              animate={isUiVisible ? 'visible' : 'hidden'}
            >
              <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
                <h2 className="text-lg md:text-xl font-semibold text-white truncate">{images[currentIndex]?.title || 'Image'}</h2>
                <button onClick={(e) => {e.stopPropagation(); onClose();}} className="p-2 rounded-full bg-black/30 hover:bg-white/20 pointer-events-auto" aria-label="Close"><XMarkIcon className="w-6 h-6 text-white" /></button>
              </div>
              <button onClick={(e) => {e.stopPropagation(); navigate('prev');}} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 pointer-events-auto" aria-label="Previous"><ChevronLeftIcon className="w-6 h-6 text-white" /></button>
              <button onClick={(e) => {e.stopPropagation(); navigate('next');}} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 pointer-events-auto" aria-label="Next"><ChevronRightIcon className="w-6 h-6 text-white" /></button>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-md pointer-events-auto">{renderMainControls()}</div>
            </motion.div>

            {/* Side Panels */}
            <AnimatePresence>
              {panelPosition !== 'hidden' && (
                <motion.div
                  key={activePanel}
                  custom={panelPosition}
                  variants={sidePanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute top-0 bottom-0 w-80 md:w-96 bg-gray-800/80 backdrop-blur-xl shadow-2xl z-30 ${panelPosition === 'left' ? 'left-0' : 'right-0'}`}
                >
                  {activePanel === 'filters' && renderFiltersPanel()}
                  {activePanel === 'details' && renderDetailsPanel()}
                  {activePanel === 'ai' && renderAiPanel()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreativeImageViewer;
