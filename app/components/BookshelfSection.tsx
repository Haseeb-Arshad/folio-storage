import { Card } from './Card';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { cn } from '../utils/cn';

// Book data to match the image exactly
const books = [
  // Shelf 1 - Matches the image exactly
  { 
    id: 1, 
    title: 'The Runners', 
    imageUrl: 'https://m.media-amazon.com/images/I/81fdQIY6ykL._AC_UF1000,1000_QL80_.jpg',
    description: 'A comprehensive guide to running techniques and training methods.'
  },
  { 
    id: 2, 
    title: 'Braun Design', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0062/7489/0343/products/clock1_1800x1800.jpg?v=1612888293',
    description: 'A celebration of Braun\'s influential industrial design philosophy.'
  },
  { 
    id: 3, 
    title: 'Leica Manual', 
    imageUrl: 'https://th.bing.com/th/id/OIP.1EH-p_jG2G7GAyLvXhq3SQHaLH?rs=1&pid=ImgDetMain',
    description: 'The definitive guide to Leica cameras and photography techniques.'
  },
  { 
    id: 4, 
    title: 'Dieter Rams', 
    imageUrl: 'https://th.bing.com/th/id/OIP.Ghu-PAw_2g9MqfuYVwGVgwHaKW?rs=1&pid=ImgDetMain',
    description: 'A retrospective of Dieter Rams\' influential design work.'
  },
  { 
    id: 5, 
    title: 'Steve Jobs', 
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/411aTMpWCdL._SX316_BO1,204,203,200_.jpg',
    description: 'The authorized biography of Apple\'s innovative co-founder.'
  },
  
  // Shelf 2 - Matches the image exactly
  { 
    id: 6, 
    title: 'Thinking with Type', 
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41iWRGjI-cL._SX398_BO1,204,203,200_.jpg',
    description: 'A critical guide for designers, writers, editors, and students.'
  },
  { 
    id: 7, 
    title: 'David Thulstrup', 
    imageUrl: 'https://thearchitectureclub.com/wp-content/uploads/2023/03/David-Thulstrup-Phaidon-book.jpg',
    description: 'Exploring the work of renowned architect and designer David Thulstrup.'
  },
  { 
    id: 8, 
    title: 'App Icon Book', 
    imageUrl: 'https://th.bing.com/th/id/R.c0e8a08c15c72082b7e0eab14da6cc02?rik=gZYI3RJ%2fqbQKlw&riu=http%3a%2f%2fkyleaschacher.com%2fwp-content%2fuploads%2f2022%2f01%2fThe-Missing-8th-App-Icon-Book-1-400x600.jpg&ehk=Z3YT8C7F6b0%2fV4uKYn5qx1bHNsQhH0pR4y9ZOGj1EQg%3d&risl=&pid=ImgRaw&r=0',
    description: 'A collection of exceptional app icon designs and their stories.'
  },
  { 
    id: 9, 
    title: 'Finnish Architecture', 
    imageUrl: 'https://images.ar.fi/images/article_images/4dd38ab8a8254f89ad1dbc55c75de9cd.jpg',
    description: 'An exploration of Finland\'s distinctive architectural tradition.'
  },
  { 
    id: 10, 
    title: 'Soled Out', 
    imageUrl: 'https://thamesandhudsonusa.com/cdn/shop/files/tha-SoledOut-CVR_2_1024x1024_46ac1bc7-df44-4bb5-a4b8-a404c6a92d1d.jpg?v=1686327652',
    description: 'The ultimate collection of sneaker advertising.'
  },
  
  // Shelf 3 - Matches the image exactly
  { 
    id: 11, 
    title: 'Jony Ive', 
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71f-m3r%2BA-L.jpg',
    description: 'The life and work of Apple\'s chief design officer.'
  },
  { 
    id: 12, 
    title: 'Helvetica', 
    imageUrl: 'https://mondoarchive.com/wp-content/uploads/2018/05/IMG_6559-810x1080.jpg',
    description: 'A celebration of the world\'s most famous typeface.'
  },
  { 
    id: 13, 
    title: 'Design as Art', 
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71cpFWgwV6L.jpg',
    description: 'Bruno Munari\'s classic examination of visual creativity.'
  },
  { 
    id: 14, 
    title: 'The Atlas of San Francisco', 
    imageUrl: 'https://th.bing.com/th/id/OIP.OdBMJqKULNwO-v2bJ9SHAgHaLH?rs=1&pid=ImgDetMain',
    description: 'A detailed cartographic exploration of the Bay Area\'s iconic city.'
  },
  { 
    id: 15, 
    title: 'Jobs', 
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51rW%2Bs0%2BbHL._SX332_BO1,204,203,200_.jpg',
    description: 'Another perspective on the life of Steve Jobs.'
  },
];

// Function to chunk books into shelves
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const booksByShelf = chunkArray(books, 5); // 5 books per shelf

// Book component with enhanced 3D opening animation
const Book = ({ book, isSelected, onSelect }: { 
  book: typeof books[0]; 
  isSelected: boolean;
  onSelect: (id: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const coverRotation = useMotionValue(0);
  const pagesRotation = useMotionValue(0);
  
  return (
    <motion.div 
      className="relative cursor-pointer group perspective"
      onClick={() => onSelect(book.id)}
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => setIsOpen(false)}
      style={{ 
        transformStyle: 'preserve-3d',
        position: 'relative',
        bottom: '-2px', // Sit on the shelf visually
      }}
      animate={{
        y: isSelected ? -15 : 0,
        rotateY: isSelected ? -8 : 0,
        z: isSelected ? 15 : 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      {/* 3D Book container */}
      <div 
        className="relative h-28 md:h-32 w-auto aspect-[2/3] overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Book Back Cover */}
        <motion.div
          className="absolute inset-0 bg-gray-800 rounded-sm shadow-md"
          style={{ 
            transformStyle: 'preserve-3d', 
            backfaceVisibility: 'hidden',
            transformOrigin: 'left center',
          }}
        ></motion.div>

        {/* Book pages */}
        <motion.div
          className="absolute inset-0 bg-white rounded-r-sm"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            rotateY: pagesRotation,
          }}
          animate={{
            rotateY: isOpen ? -160 : 0,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
          }}
        >
          {/* Page texture */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(to bottom, transparent, transparent 9px, rgba(0,0,0,0.03) 10px)',
            }}
          >
            {/* Page edge shadow */}
            <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-gradient-to-l from-gray-300 to-transparent"></div>
          </div>
        </motion.div>
        
        {/* Book front cover */}
        <motion.div
          className="absolute inset-0 rounded-sm shadow-lg overflow-hidden"
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            rotateY: coverRotation,
          }}
          animate={{
            rotateY: isOpen ? -170 : 0,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }}
        >
          {/* Cover image */}
          <img
            src={book.imageUrl}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          
          {/* Inner cover highlight */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"
            style={{ pointerEvents: 'none' }}
          ></div>
        </motion.div>
        
        {/* Book spine */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-[6px] bg-gray-200 rounded-l-sm"
          style={{ 
            transformOrigin: 'left center',
            transform: 'rotateY(90deg) translateX(-3px)',
            background: `linear-gradient(to right, ${getColorFromImage(book.imageUrl)}, #f3f4f6)`,
          }}
        >
          {/* Spine highlights */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
        
        {/* Book top edge */}
        <div 
          className="absolute left-0 right-0 top-0 h-[4px] bg-gray-100 rounded-t-sm"
          style={{ 
            transformOrigin: 'top center',
            transform: 'rotateX(-90deg)',
            background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
          }}
        ></div>
        
        {/* Book bottom edge */}
        <div 
          className="absolute left-0 right-0 bottom-0 h-[4px] bg-gray-200 rounded-b-sm"
          style={{ 
            transformOrigin: 'bottom center',
            transform: 'rotateX(90deg)',
            background: 'linear-gradient(to top, #e5e7eb, #f3f4f6)',
          }}
        ></div>
      </div>

      {/* Book shadow */}
      <motion.div 
        className="absolute -bottom-1 left-1 right-1 h-4 rounded-full blur-sm"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
          transform: 'translateY(2px) rotateX(70deg) scale(0.9, 0.8)',
          opacity: 0.2,
        }}
        animate={{
          opacity: isOpen ? 0.4 : 0.2,
          scale: isOpen ? [0.9, 1.1, 0.9] : 0.9,
          transition: { duration: 0.5 }
        }}
      ></motion.div>

      {/* Book tooltip */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute bottom-full left-1/2 mb-3 p-2.5 bg-gray-800 text-white rounded-md shadow-lg w-52 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-xs tracking-wide leading-tight">{book.title}</h3>
            <p className="text-xs text-gray-300 mt-1 leading-snug">{book.description}</p>
            <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to get a color from book image URL (simplified version)
function getColorFromImage(imageUrl: string): string {
  // This is a simplified approach - in a real app you might use a color extraction library
  // For now, use a basic hash of the URL to generate a consistent color
  const hash = imageUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 35%)`;
}

// Shelf component restyled to match the image (white, 3D perspective)
const Shelf = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative my-8 w-full perspective group">
        {/* Shelf Structure */}
        <div className="relative w-full h-[18px]" style={{ transformStyle: "preserve-3d" }}>
            {/* Top Surface */}
            <div 
                className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 rounded-sm shadow-sm"
                style={{
                    transform: "rotateX(15deg) translateZ(-1px)", // Tilted perspective
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                }}
            ></div>
            {/* Front Edge */}
            <div 
                className="absolute bottom-0 left-0 w-full h-[12px] bg-gradient-to-t from-gray-200 to-gray-100 rounded-b-sm"
                style={{
                    transformOrigin: 'top center',
                    transform: "rotateX(-75deg) translateY(12px) translateZ(0px)", // Angled front edge
                    boxShadow: '0px 2px 3px rgba(0,0,0,0.1)'
                }}
            ></div>
             {/* Subtle highlight on top edge */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/80" style={{transform: "rotateX(15deg) translateZ(0px)"}}></div>
        </div>

        {/* Books container - Placed slightly above the visual shelf top */}
        <div className="absolute -top-28 md:-top-32 left-0 right-0 flex items-end justify-center space-x-3 md:space-x-4 px-4">
            {children}
        </div>

        {/* Overall Shelf Shadow */}
        <div 
            className="absolute -bottom-6 left-4 right-4 h-10 bg-black/20 rounded-full blur-xl opacity-60 group-hover:opacity-70 transition-opacity duration-300"
            style={{
                transform: "translateY(10px)" // Position shadow below the shelf
            }}
        >
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
    <Card className="relative overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">My Bookshelf</h2>
        <p className="text-gray-600 mb-6">Design &amp; tech books that inspire me</p>
        
        <div className="space-y-4">
          {/* First Shelf */}
          <Shelf>
            {booksByShelf[0].map(book => (
              <Book 
                key={book.id} 
                book={book} 
                isSelected={selectedBookId === book.id}
                onSelect={handleSelectBook}
              />
            ))}
          </Shelf>
          
          {/* Second Shelf */}
          <Shelf>
            {booksByShelf[1].map(book => (
              <Book 
                key={book.id} 
                book={book} 
                isSelected={selectedBookId === book.id}
                onSelect={handleSelectBook}
              />
            ))}
          </Shelf>
          
          {/* Third Shelf */}
          <Shelf>
            {booksByShelf[2].map(book => (
              <Book 
                key={book.id} 
                book={book} 
                isSelected={selectedBookId === book.id}
                onSelect={handleSelectBook}
              />
            ))}
          </Shelf>
        </div>
      </div>
    </Card>
  );
} 