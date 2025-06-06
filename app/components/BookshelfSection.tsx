import { Card } from './Card';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Updated book data with real image URLs and dimensions to match the reference
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

  return (
    <motion.div
      className={cn(
        "relative mx-[4px] md:mx-[6px]", // Slightly increased margin for better spacing
        isOpen ? "z-10" : "z-0",
        "cursor-pointer"
      )}
      style={{
        width: book.width,
        height: book.height,
        // Contact shadow for the book on the shelf
        filter: isOpen 
          ? 'drop-shadow(0px 8px 12px rgba(0,0,0,0.25)) drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' 
          : 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15)) drop-shadow(0px 1px 2px rgba(0,0,0,0.1))',
        transition: 'filter 0.3s ease-out',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(book.id)}
    >
      <div
        className="relative w-full h-full"
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }} // Increased perspective
      >
        {/* Book Spine - shows part of the cover image */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${book.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center', // Show left edge of image for spine
            transformStyle: 'preserve-3d',
            borderRadius: '2px 0 0 2px', // Slightly rounded spine edge
          }}
        />

        {/* Book Cover */}
        <motion.div
          className="absolute inset-0 rounded-sm shadow-xl overflow-hidden"
          style={{
            backgroundImage: `url(${book.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            borderRadius: '0 2px 2px 0', // Slightly rounded cover edge
          }}
          animate={{
            rotateY: isOpen ? -70 : 0, // Adjusted rotation for hardcover feel
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, // Smoother ease
          }}
        >
          {/* Subtle gloss/highlight effect on cover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10 group-hover:opacity-5 transition-opacity"></div>
        </motion.div>

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
    <div className="relative w-full mb-14 md:mb-18">
      {/* Container for books, ensuring they sit visually on the plank */}
      <div className="relative flex justify-center items-end mb-[-1px] h-[110px] md:h-[125px]"> {/* Adjusted mb for thinner plank */}
        {children}
      </div>
      <div className="relative w-[90%] md:w-[85%] mx-auto">
        {/* Shelf Plank - thinner */}
        <div className="h-[8px] bg-white rounded-sm shadow-md"></div> {/* Was shadow-lg, now shadow-md. Was h-[12px] */}
        {/* Subtle floating shadow below the shelf plank */}
        <div
          className="absolute left-[5%] right-[5%] -bottom-[5px] h-[18px] bg-black/5 rounded-[50%] blur-lg opacity-60 z-[-1]"
          // Refined shadow properties for a more subtle floating effect
        ></div>
      </div>
    </div>
  );
};

export function BookshelfSection() {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const handleSelectBook = (id: number) => {
    setSelectedBookId(prevId => prevId === id ? null : id);
  };

  return (
    <Card className="relative overflow-hidden p-6 md:p-10 bg-gray-50">
      <div className="grid grid-cols-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2.5">My bookshelf</h2>
        <p className="text-gray-600 mb-10 md:mb-14 text-sm md:text-base">Design & tech books that inspire me</p>
        
        <div className="space-y-12 md:space-y-16">
          {booksByShelf.map((shelfBooks, index) => (
            <Shelf key={`shelf-${index}`}>
              {shelfBooks.map(book => (
                <Book 
                  key={book.id} 
                  book={book} 
                  isSelected={selectedBookId === book.id}
                  onSelect={handleSelectBook}
                />
              ))}
            </Shelf>
          ))}
        </div>
      </div>
    </Card>
  );
}
