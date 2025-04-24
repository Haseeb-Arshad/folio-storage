import React from 'react';
import { PhotographySection } from './PhotographySection';
import { BookshelfSection } from './BookshelfSection';
import { ListeningToSection } from './ListeningToSection';
import VideoPlayer from './VideoPlayer';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12 antialiased">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Photo Gallery Section */}
        <section className="relative">
          <PhotographySection />
        </section>
        
        {/* Two Column Layout for Bookshelf and Music/Video */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Bookshelf Column */}
          <section className="h-full">
            <BookshelfSection />
          </section>
          
          {/* Music and Video Column */}
          <div className="space-y-8 md:space-y-12 h-full flex flex-col">
            <section className="flex-1">
              <ListeningToSection />
            </section>
            <section className="flex-1">
              <VideoPlayer />
            </section>
          </div>
        </div>
        
        {children}
      </div>
      
      {/* Footer with attribution */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} | Crafted with ❤️</p>
      </footer>
    </div>
  );
} 