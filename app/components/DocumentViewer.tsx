import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../utils/cn';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BookSection {
  id: string;
  title: string;
  content: string;
}

interface DocumentViewerProps {
  title?: string;
  sections: BookSection[];
  className?: string;
}

export function DocumentViewer({ title = 'Document Viewer', sections, className }: DocumentViewerProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track cursor position for the orange dot
  const handleMouseMove = (e: React.MouseEvent) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  // Handle section change with smooth transitions
  const changeSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Set up GSAP animations for the content transitions
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power2.out' 
        }
      );
    }
  }, [activeSection]);

  const getCurrentSection = () => {
    return sections.find(section => section.id === activeSection) || sections[0];
  };

  return (
    <div 
      className={cn(
        "relative w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Top Navigation Bar */}
      <div 
        ref={navRef}
        className="relative bg-gray-900 text-white p-4 flex items-center"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Orange cursor dot */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="absolute w-4 h-4 bg-orange-500 rounded-full pointer-events-none z-10"
              style={{
                x: cursorPosition.x - 8, // Center the dot on cursor
                y: cursorPosition.y - 8
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Book sections */}
        <div className="relative w-full overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4 px-2">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className={cn(
                  "px-4 py-2 cursor-pointer whitespace-nowrap transition-colors",
                  activeSection === section.id ? "text-orange-400" : "text-gray-400"
                )}
                onClick={() => changeSection(section.id)}
                whileHover={{ y: -2 }}
              >
                {section.title}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative p-8 min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            ref={contentRef}
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20
            }}
          >
            {/* Display current section content */}
            {getCurrentSection() && (
              <>
                <h2 className="text-3xl font-serif mb-6 text-gray-800 tracking-tight">
                  {getCurrentSection().title}
                </h2>
                <div dangerouslySetInnerHTML={{ __html: getCurrentSection().content }} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom styles for the viewer */}
      <style jsx global>{`
        /* Hide scrollbar but maintain functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Style the document content */
        .prose img {
          border-radius: 4px;
          margin: 1.5rem 0;
        }

        .prose p {
          line-height: 1.8;
        }

        /* Custom transitions for page elements */
        .prose > * {
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
