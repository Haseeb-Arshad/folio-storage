import { Card } from './Card';
import { FolderCard } from './FolderCard';
import { ExternalLinkIcon, InstagramIcon } from './icons';

// Photo album data to match the image
const photoAlbums = [
  {
    title: 'Japan 2024',
    photoCount: 83,
    imageUrls: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1580135657198-980fa0c5d6f4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1574236170880-78841ee7265d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    ],
    stickerUrls: [
      'https://img.icons8.com/fluency/48/japan-circular.png', 
      'https://img.icons8.com/office/40/torii.png'
    ],
  },
  {
    title: 'Paris 2024',
    photoCount: 62,
    imageUrls: [
      'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1524396309943-e03f5249f002?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1511739172509-0e5da94641e0?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    ],
    stickerUrls: [
      'https://img.icons8.com/color/48/eiffel-tower.png',
      'https://img.icons8.com/color/48/france-circular.png'
    ],
  },
  {
    title: 'Amsterdam 2024',
    photoCount: 68,
    imageUrls: [
      'https://images.unsplash.com/photo-1576924542622-772281baaf38?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1612521605237-0043a7d3e551?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1584003564911-a7a361c9ab48?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    ],
    stickerUrls: [
        'https://img.icons8.com/office/40/tulip.png',
        'https://img.icons8.com/color/48/netherlands-circular.png'
    ],
  },
  {
    title: 'Other photos',
    photoCount: 247,
    imageUrls: [
        'https://images.unsplash.com/photo-1664574654529-b60630a85e5e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    ],
    stickerUrls: [
        'https://img.icons8.com/fluency/48/slr-camera.png',
        'https://img.icons8.com/office/40/negative-film.png'
    ],
  },
];


export function PhotographySection() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">My photography</h2>
        <a
          href="#" // Replace with actual Instagram link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <InstagramIcon className="w-4 h-4 text-gray-500" />
          My Instagram
          <ExternalLinkIcon className="w-3 h-3 text-gray-500" />
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {photoAlbums.map((album) => (
          <FolderCard
            key={album.title}
            title={album.title}
            photoCount={album.photoCount}
            imageUrls={album.imageUrls}
            stickerUrls={album.stickerUrls}
          />
        ))}
      </div>
    </Card>
  );
} 