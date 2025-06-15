import { Card } from './Card';
import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';

// Book data with optimized images and dimensions for 3D effect
interface BookEntry {
  id: number;
  title: string;
  author?: string;
  imageUrl: string;
  description?: string;
  readStatus?: string;
  notes?: string;
  dateRead?: string;
  width: string;
  height: string;
}

const books = [
  {
    id: 1,
    title: 'The Making of Prince of Persia',
    author: 'Jordan Mechner',
    imageUrl: 'https://m.media-amazon.com/images/I/81j5m9XUvjL._AC_UF1000,1000_QL80_.jpg',
    description: 'Journals from the creator of Prince of Persia.',
    readStatus: 'Read',
    notes: 'A fascinating look into game development.',
    width: '70px', 
    height: '100px'
  },
  {
    id: 2,
    title: 'Braun: Less and More',
    author: 'Various',
    imageUrl: 'https://www.normann-copenhagen.com/cdn/shop/products/braun-design-book-1_1600x.jpg?v=1616073777',
    description: 'The world of Braun design.',
    readStatus: 'Currently Reading',
    width: '65px', 
    height: '100px'
  },
  {
    id: 3,
    title: 'Leica M: Advanced Photo School',
    author: 'Gunter Osterloh',
    imageUrl: 'https://www.leicastoremiami.com/cdn/shop/products/9783667121059_LEICA_M_ADVANCED_PHOTO_SCHOOL_EN_1_1_1024x1024.jpg?v=1642008861',
    description: 'Mastering the Leica M system.',
    readStatus: 'Read',
    width: '60px', 
    height: '100px'
  },
  {
    id: 4,
    title: 'Dieter Rams: As Little Design as Possible',
    author: 'Sophie Lovell',
    imageUrl: 'https://www.phaidon.com/images/custom/9780714849186_000000_S_001_A.jpg', // Example
    description: 'An in-depth look at the work and philosophy of Dieter Rams.',
    readStatus: 'Read',
    notes: 'Iconic. Less, but better.',
    width: '72px', 
    height: '108px'
  },
  {
    id: 5,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    imageUrl: 'https://buybookbook.com/cdn/shop/files/SteveJobs-ABiography.jpg?v=1734703509', // Example
    description: 'The authorized biography of Apple co-founder Steve Jobs.',
    readStatus: 'Read',
    dateRead: 'January 2023',
    notes: 'A truly inspirational journey of innovation and focus.',
    width: '70px', 
    height: '105px'
  },
  // Shelf 2 - Add 5 more books with similar structure
  {
    id: 6,
    title: 'Universal Principles of Design',
    author: 'William Lidwell, Kritina Holden, Jill Butler',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71j1U2YOF9L.jpg', // Example
    description: '125 Ways to Enhance Usability, Influence Perception, Increase Appeal, Make Better Design Decisions, and Teach through Design.',
    readStatus: 'Read',
    dateRead: 'March 2023',
    width: '70px', 
    height: '100px'
  },
  {
    id: 7,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81c7Qj4iJWL.jpg', // Example
    description: 'Revised and expanded edition on how design serves as the communication between object and user.',
    readStatus: 'Currently Reading',
    width: '68px', 
    height: '102px'
  },
  {
    id: 8,
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71yDY3S2nSL.jpg',
    description: 'A guide to building products people can’t put down.',
    readStatus: 'Read',
    notes: 'Insightful for product design.',
    width: '65px', 
    height: '100px'
  },
  {
    id: 9,
    title: '100 Years of Swiss Design',
    author: 'Museum für Gestaltung Zürich',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81eB7Y6XNGL.jpg', // Example
    description: 'A comprehensive overview of a century of influential Swiss design.',
    readStatus: 'Unread',
    width: '72px', 
    height: '108px'
  },
  {
    id: 10,
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/717m7rN4NCL.jpg', // Example
    description: 'A visual communication manual for graphic designers, typographers and three dimensional designers.',
    readStatus: 'Read',
    dateRead: 'Feb 2024',
    width: '60px', 
    height: '100px'
  }
];

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

const booksByShelf = chunkArray(books, 5);

const Book = ({ book, isSelected, onSelect }: { 
  book: BookEntry; 
  isSelected: boolean;
  onSelect: (id: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isOpen = isHovered || isSelected;
  const rotateY = useMotionValue(0);
  const scale = useTransform(rotateY, [0, -70], [1, 1.05]);
  const zIndex = useTransform(rotateY, [0, -70], [1, 10]);

  return (
    <motion.div
      className={cn(
        "relative mx-[4px] md:mx-[6px] cursor-pointer",
        isOpen ? "z-10" : "z-0"
      )}
      style={{
        width: book.width,
        height: book.height,
        zIndex: isOpen ? 10 : 'auto',
        scale: isOpen ? 1.1 : 1,
        y: isOpen ? -15 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(book.id)}
    >
      <div 
        className="relative w-full h-full"
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Book Spine */}
        <motion.div
          className="absolute left-0 top-0 h-full w-2 bg-gray-800 rounded-l-sm overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1), transparent), url(${book.imageUrl})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left center',
            transform: 'rotateY(90deg) translateZ(1px)',
            transformOrigin: 'left center',
            boxShadow: 'inset -10px 0 20px -10px rgba(0,0,0,0.5)',
          }}
          animate={{
            opacity: isOpen ? 0 : 1,
            transition: { duration: 0.3 }
          }}
        />

        {/* Book Cover */}
        <motion.div
          className="absolute inset-0 rounded-r-sm overflow-hidden"
          style={{
            backgroundImage: `url(${book.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
            zIndex: 2
          }}
          animate={{
            rotateY: isOpen ? -55 : 0,
            transition: { 
              duration: 0.5, 
              ease: [0.16, 0.77, 0.47, 0.97] 
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 group-hover:opacity-10 transition-opacity" />
        </motion.div>

        {/* Book Pages */}
        <motion.div
          className="absolute inset-0 bg-white rounded-r-sm"
          style={{
            transformOrigin: 'left center',
            transform: 'translateZ(-1px)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
            zIndex: 1
          }}
          animate={{
            rotateY: isOpen ? -5 : 0,
            transition: {
              delay: isOpen ? 0.15 : 0,
              duration: 0.5,
              ease: [0.16, 0.77, 0.47, 0.97]
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white p-4 overflow-hidden">
            <div className="h-full border-l-2 border-gray-200 pl-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">{book.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-4">
                {book.description || 'No description available.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reflection */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'scaleY(-1) translateY(4px)',
            transformOrigin: 'top center',
            backgroundImage: `url(${book.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
            filter: 'blur(0.5px)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)'
          }}
          animate={{ rotateY: isOpen ? -55 : 0, transition: { duration: 0.5, ease: [0.16,0.77,0.47,0.97] } }}
        />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute -top-5 left-1/2 w-56 p-3.5 bg-gray-900 bg-opacity-85 backdrop-blur-lg text-white text-sm rounded-lg shadow-2xl z-20 pointer-events-none"
              style={{ transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: -30, scale: 1, transition: { delay: 0.1, duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -15, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } }}
            >
              <h4 className="font-semibold text-base mb-1 truncate">{book.title}</h4>
              {book.author && <p className="text-xs text-gray-300 mb-1.5">By {book.author}</p>}
              {book.description && <p className="mb-2 text-gray-200 text-xs leading-snug">{book.description}</p>}
              {book.readStatus && 
                <p className="text-xs mb-1"><span className="font-medium text-gray-400">Status:</span> {book.readStatus}{book.dateRead ? ` (${book.dateRead})` : ''}</p>}
              {book.notes && <p className="text-xs text-gray-400 italic"><span className="font-medium">Notes:</span> {book.notes}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Shelf = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mb-10">
      <div className="flex justify-center items-end px-2">
        {children}
      </div>
      {/* Shelf */}
      <div 
        className="h-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-sm mt-6 mx-auto relative z-0" 
        style={{ 
          width: 'calc(100% + 40px)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          transform: 'perspective(800px) rotateX(-8deg) translateY(-10px)',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900/5 via-amber-800/10 to-amber-900/5"></div>
      </div>
      {/* Shadow */}
      <div 
        className="h-6 bg-gradient-to-b from-gray-400/10 to-transparent -mt-1 mx-auto blur-sm" 
        style={{ 
          width: 'calc(100% + 20px)',
        }}
      ></div>
    </div>
  );
};

export function BookshelfSection() {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const handleBookSelect = (id: number) => {
    setSelectedBook(selectedBook === id ? null : id);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto px-8 py-16 bg-white/90 backdrop-blur-md border border-gray-200">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 font-serif tracking-tight">
        My Bookshelf
      </h2>
      
      <div className="space-y-16">
        {booksByShelf.map((shelf, shelfIndex) => (
          <Shelf key={shelfIndex}>
            {shelf.map((book) => (
              <Book 
                key={book.id} 
                book={book} 
                isSelected={selectedBook === book.id}
                onSelect={handleBookSelect}
              />
            ))}
          </Shelf>
        ))}
      </div>

      <style>{`
        /* Smooth scrolling for the page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Better text rendering for book titles */
        .book-title {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        
        /* Custom scrollbar for book content */
        .book-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .book-content::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        
        .book-content::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
      `}</style>
    </Card>
  );
}
