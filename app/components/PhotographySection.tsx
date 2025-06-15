import { Card } from './Card';
import { FolderCard } from './FolderCard';
import { ExternalLinkIcon, InstagramIcon } from './icons';
import { photoAlbums } from '../data/photoAlbums';


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