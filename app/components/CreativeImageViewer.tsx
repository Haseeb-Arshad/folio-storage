import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  PaintBrushIcon,
  ArrowPathRoundedSquareIcon as RotateCcwIcon,
  AdjustmentsHorizontalIcon as FiltersIcon,
  InformationCircleIcon,
  SparklesIcon,
  ArrowUturnLeftIcon,
  PhotoIcon,
  ArrowsPointingOutIcon,
  CameraIcon,
  SunIcon
} from '@heroicons/react/24/outline';

interface CreativeImageViewerProps {
  isOpen: boolean;
  imageUrls: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  grayscale: number;
  sepia: number;
  blur: number;
  saturate: number;
  hueRotate: number;
}

const initialFilters: ImageFilters = { 
  brightness: 100, 
  contrast: 100, 
  grayscale: 0, 
  sepia: 0, 
  blur: 0, 
  saturate: 100, 
  hueRotate: 0 
};

type ActivePanel = 'main' | 'filters' | 'details' | 'ai';

type ImageTransitionState = 'entering' | 'visible' | 'exiting' | 'none';

type PanelPosition = 'left' | 'right' | 'hidden';

const CreativeImageViewer: React.FC<CreativeImageViewerProps> = ({
  isOpen,
  imageUrls,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  // Core image state
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filters, setFilters] = useState<ImageFilters>(initialFilters);
  
  // UI state
  const [activePanel, setActivePanel] = useState<ActivePanel>('main');
  const [panelPosition, setPanelPosition] = useState<PanelPosition>('hidden');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [transitionState, setTransitionState] = useState<ImageTransitionState>('none');
  
  // Animation controls
  const imageControls = useAnimation();
  const panelControls = useAnimation();
  
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const previousImageUrl = useRef<string | null>(null);
  
  const imageUrl = imageUrls[currentIndex];
  
  // AI enhancement suggestions
  const aiSuggestions = [
    { name: "Vibrant", filters: { brightness: 110, contrast: 120, saturate: 130, hueRotate: 0 } },
    { name: "Dramatic", filters: { brightness: 95, contrast: 140, saturate: 110, grayscale: 0 } },
    { name: "Vintage", filters: { brightness: 95, contrast: 90, saturate: 80, sepia: 30 } },
    { name: "B&W Portrait", filters: { brightness: 105, contrast: 110, grayscale: 100, sepia: 0 } },
    { name: "HD Clarity", filters: { brightness: 105, contrast: 115, saturate: 105, blur: 0 } },
    { name: "Warm Sunset", filters: { brightness: 102, contrast: 105, saturate: 120, hueRotate: 15 } },
  ];

  // Handle image transitions and reset states when current image changes
  useEffect(() => {
    if (isOpen) {
      // If we have a previous image, start transition
      if (previousImageUrl.current && previousImageUrl.current !== imageUrl) {
        setTransitionState('exiting');
        
        // Animate current image out
        imageControls.start({
          opacity: 0,
          transition: { duration: 0.6, ease: 'easeInOut' }
        }).then(() => {
          // Reset states for new image
          setCurrentTitle(`Image ${currentIndex + 1}`);
          setCurrentDescription(`Details for image ${currentIndex + 1}.`);
          setZoomLevel(1);
          setRotation(0);
          setFilters(initialFilters);
          setActivePanel('main');
          setPanelPosition('hidden');
          setImageLoaded(false);
          setTransitionState('entering');
        });
      } else {
        // Initial load
        setCurrentTitle(`Image ${currentIndex + 1}`);
        setCurrentDescription(`Details for image ${currentIndex + 1}.`);
        setZoomLevel(1);
        setRotation(0);
        setFilters(initialFilters);
        setActivePanel('main');
        setPanelPosition('hidden');
        setTransitionState('entering');
      }
      
      // Store current image URL for next transition
      previousImageUrl.current = imageUrl;
    }
  }, [isOpen, currentIndex, imageUrl, imageControls]);
  
  // Handle image load complete
  const handleImageLoaded = () => {
    setImageLoaded(true);
    setTransitionState('visible');
    imageControls.start({
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' }
    });
  };
  
  // Handle panel toggle
  const togglePanel = (panel: ActivePanel, position: PanelPosition = 'right') => {
    // If clicking the current active panel button
    if (activePanel === panel && panelPosition !== 'hidden') {
      panelControls.start({
        x: position === 'right' ? '100%' : '-100%',
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }).then(() => {
        setPanelPosition('hidden');
      });
    } 
    // If showing a new panel or switching panels
    else {
      setActivePanel(panel);
      setPanelPosition(position);
      
      // Animate panel in from correct side
      panelControls.set({ 
        x: position === 'right' ? '100%' : '-100%',
        opacity: 0 
      });
      panelControls.start({ 
        x: 0, 
        opacity: 1,
        transition: { type: 'spring', damping: 26, stiffness: 300 }
      });
    }
  };

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${currentTitle.replace(/\s+/g, '_') || `image_${currentIndex + 1}`}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, currentTitle, currentIndex]);

  const imageStyle = useMemo(() => ({
    transform: `rotate(${rotation}deg) scale(${zoomLevel})`,
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px) saturate(${filters.saturate}%) hue-rotate(${filters.hueRotate}deg)`,
    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), filter 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
  }), [rotation, zoomLevel, filters]);
  
  // Apply a suggested filter preset
  const applyFilterPreset = (preset: Partial<ImageFilters>) => {
    setFilters(current => ({ ...current, ...preset }));
  };
  
  // Apply AI enhancement suggestion
  const applyAiSuggestion = (suggestion: { filters: Partial<ImageFilters> }) => {
    setFilters(current => ({ ...current, ...suggestion.filters }));
  };

  const resetImageTransforms = useCallback(() => {
    // Animate the reset for a more satisfying effect
    const timeline = async () => {
      await imageControls.start({
        scale: 0.95,
        opacity: 0.8,
        transition: { duration: 0.3 }
      });
      
      setZoomLevel(1);
      setRotation(0);
      setFilters(initialFilters);
      
      await imageControls.start({
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', damping: 15, stiffness: 200 }
      });
    };
    
    timeline();
  }, [imageControls]);

  if (!isOpen) return null;

  // Enhanced animation variants
  const backdropVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { duration: 0.4 } }, 
    exit: { opacity: 0, transition: { duration: 0.4 } } 
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        damping: 22, 
        stiffness: 150, 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom bezier curve for smooth entrance
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.94, 
      transition: { 
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0] // Custom bezier curve for smooth exit
      } 
    },
  };
  
  const bottomPanelVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 220,
        delay: 0.1 // Slight delay for staggered animation
      } 
    },
    exit: { 
      y: '100%', 
      opacity: 0, 
      transition: { 
        duration: 0.25,
        ease: 'easeOut' 
      } 
    },
  };
  
  const sidePanelVariants = {
    hidden: (side: 'left' | 'right') => ({
      x: side === 'left' ? '-100%' : '100%',
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 28,
        stiffness: 260
      }
    },
    exit: (side: 'left' | 'right') => ({
      x: side === 'left' ? '-100%' : '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    })
  };
  
  const imageTransitionVariants = {
    entering: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exiting: { 
      opacity: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.32, 0, 0.67, 0] 
      }
    }
  };

  // Enhanced control button with improved animation
  const ControlButton: React.FC<{
    Icon: React.ElementType;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    className?: string;
  }> = ({ Icon, label, onClick, isActive, className = '' }) => (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-center w-[70px] h-[70px] transition-all duration-300 ease-out group ${className}`}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
    >
      <motion.div 
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${isActive ? 'bg-indigo-500/90 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/10 text-gray-200'}`}
        whileHover={{ 
          scale: 1.08,
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.9)' : 'rgba(255, 255, 255, 0.2)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <span className={`mt-1.5 text-[10px] font-medium tracking-wide transition-colors group-hover:text-white ${isActive ? 'text-indigo-300' : 'text-gray-400'}`}>
        {label.toUpperCase()}
      </span>
    </motion.button>
  );
  
  // Button specifically for AI filter presets with visual preview
  const FilterPresetButton: React.FC<{
    name: string;
    onClick: () => void;
    previewStyle: React.CSSProperties;
  }> = ({ name, onClick, previewStyle }) => (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200"
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="w-16 h-16 rounded-md overflow-hidden border border-white/10 shadow-md">
        {imageUrl && (
          <div className="w-full h-full bg-cover bg-center" 
            style={{
              backgroundImage: `url(${imageUrl})`,
              ...previewStyle
            }}
          />
        )}
      </div>
      <span className="text-xs font-medium text-gray-300">{name}</span>
    </motion.button>
  );

  // Enhanced filter slider with improved visual feedback
  const renderFilterSlider = (filterKey: keyof ImageFilters, label: string, min: number, max: number, unit: string = '%') => (
    <motion.div 
      className="my-3 px-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={filterKey} className="block text-xs font-medium text-gray-300">
          {label}
        </label>
        <motion.span 
          className="text-xs font-semibold bg-indigo-500/90 text-white px-1.5 py-0.5 rounded-full"
          animate={{ 
            scale: [1, 1.05, 1],
            backgroundColor: filters[filterKey] === initialFilters[filterKey] ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.9)' 
          }}
          transition={{ duration: 0.2 }}
        >
          {filters[filterKey]}{unit}
        </motion.span>
      </div>
      <div className="relative w-full">
        <input
          type="range"
          id={filterKey}
          min={min}
          max={max}
          value={filters[filterKey]}
          onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: parseInt(e.target.value) }))}
          className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 relative z-10"
        />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500/50 rounded-full -translate-y-1/2 z-0"
          style={{ width: `${((filters[filterKey] - min) / (max - min)) * 100}%` }}
        />
      </div>
    </motion.div>
  );

  const renderMainControls = () => (
    <motion.div key="main-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-around items-center w-full px-2">
      <ControlButton Icon={InformationCircleIcon} label="Details" onClick={() => setActivePanel('details')} isActive={activePanel === 'details'} />
      <ControlButton Icon={PaintBrushIcon} label="Edit" onClick={() => setActivePanel('filters')} isActive={activePanel === 'filters'} />
      <ControlButton Icon={MagnifyingGlassPlusIcon} label="Zoom In" onClick={() => setZoomLevel(z => Math.min(z + 0.2, 3))} />
      <ControlButton Icon={MagnifyingGlassMinusIcon} label="Zoom Out" onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.5))} />
      <ControlButton Icon={ArrowDownTrayIcon} label="Download" onClick={handleDownload} />
    </motion.div>
  );

  const renderFiltersPanel = () => (
    <motion.div key="filters-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col px-1">
      <div className="flex justify-between items-center px-3 pt-2 pb-1">
        <button onClick={() => setActivePanel('main')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
        </button>
        <h3 className="text-sm font-semibold text-white">Filters & Transform</h3>
        <button onClick={resetImageTransforms} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
          <ArrowUturnLeftIcon className="w-4 h-4 mr-1" /> Reset
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-2 px-2 mt-2">
         <ControlButton Icon={RotateCcwIcon} label="Rotate" onClick={() => setRotation(r => r - 90)} className="w-full h-auto py-2 !text-xs" />
         {/* Add more transform controls here if needed, e.g., flip */}
      </div>
      {renderFilterSlider('brightness', 'Brightness', 0, 200)}
      {renderFilterSlider('contrast', 'Contrast', 0, 200)}
      {renderFilterSlider('grayscale', 'Grayscale', 0, 100)}
      {renderFilterSlider('sepia', 'Sepia', 0, 100)}
    </motion.div>
  );

  const renderDetailsPanel = () => (
    <motion.div key="details-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col px-3 py-2 text-sm">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setActivePanel('main')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
        </button>
        <h3 className="text-sm font-semibold text-white">Image Details</h3>
        <div>{/* Placeholder for right side action */}</div>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-400 mb-0.5">Title</label>
        <input 
          type="text" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}
          className="block w-full bg-white/5 border-white/10 rounded-md py-1.5 px-2.5 text-xs focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-0.5">Description</label>
        <textarea 
          value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} rows={3}
          className="block w-full bg-white/5 border-white/10 rounded-md py-1.5 px-2.5 text-xs focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500 scrollbar-thin scrollbar-thumb-gray-600/80 scrollbar-track-transparent"
        />
      </div>
      <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-xs mt-2 truncate block">View Original File</a>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-[1000] p-0"
          onClick={onClose} // Close on backdrop click
        >
          {/* Top bar for Close button and Title (optional) */}
          <div className="absolute top-0 left-0 right-0 h-12 md:h-14 flex items-center justify-between px-3 md:px-4 z-20">
            <div className="text-white text-sm md:text-base font-medium truncate max-w-[calc(100%-80px)]">
              {activePanel === 'details' ? 'Editing Details' : currentTitle}
            </div>
            <button onClick={onClose} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Area */}
          <motion.div
            key="modal-content"
            variants={modalVariants}
            initial="hidden" animate="visible" exit="exit"
            className="relative w-full h-full flex items-center justify-center overflow-hidden pt-12 md:pt-14 pb-[120px] md:pb-[140px]" // Padding top for top bar, padding bottom for control panel
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click through
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={imageUrl} // Important for re-animation on image change
                src={imageUrl}
                alt={currentTitle}
                className="max-w-full max-h-full object-contain cursor-grab select-none"
                style={imageStyle}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.05}
                whileTap={{ cursor: 'grabbing' }}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            {imageUrls.length > 1 && (
              <>
                <button 
                  onClick={() => onNavigate(currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1)}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button 
                  onClick={() => onNavigate(currentIndex === imageUrls.length - 1 ? 0 : currentIndex + 1)}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}
          </motion.div>

          {/* Bottom Control Panel */}
          <motion.div
            key="bottom-panel"
            variants={bottomPanelVariants}
            initial="hidden" animate="visible" exit="exit"
            className="absolute bottom-0 left-0 right-0 h-auto bg-black/60 backdrop-blur-xl shadow-2xl z-20 rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click through
          >
            <div className="w-full max-w-md mx-auto py-3 md:py-4">
              <AnimatePresence mode="wait">
                {activePanel === 'main' && renderMainControls()}
                {activePanel === 'filters' && renderFiltersPanel()}
                {activePanel === 'details' && renderDetailsPanel()}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreativeImageViewer;
