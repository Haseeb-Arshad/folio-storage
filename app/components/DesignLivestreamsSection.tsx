import { Card } from './Card';
import { ExternalLinkIcon, YoutubeIcon } from './icons';

// Placeholder YouTube video ID
const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up :)

export function DesignLivestreamsSection() {
  return (
    <Card className="overflow-hidden"> {/* Allow legs to potentially overflow slightly */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Design livestreams</h2>
        <a
          href="#" // Replace with your actual YouTube channel link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <YoutubeIcon className="w-4 h-4 text-red-600" />
          My YouTube
          <ExternalLinkIcon className="w-3 h-3 text-gray-500" />
        </a>
      </div>

      <div className="relative w-full aspect-video mx-auto max-w-xl"> {/* Container for TV shape */}
        {/* TV Screen Bezel */}
        <div className="relative w-full h-full bg-gray-900 rounded-lg md:rounded-xl shadow-xl overflow-hidden p-2 border-4 border-gray-100">
          {/* YouTube Embed */}
          <iframe 
            className="w-full h-full rounded-sm md:rounded-md"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* TV Legs */}
        <div className="absolute bottom-[-25px] left-1/4 w-1 h-8 bg-gradient-to-b from-amber-700 to-amber-800 transform rotate-[15deg] rounded-b-sm shadow-sm"></div>
        <div className="absolute bottom-[-25px] right-1/4 w-1 h-8 bg-gradient-to-b from-amber-700 to-amber-800 transform -rotate-[15deg] rounded-b-sm shadow-sm"></div>

        {/* Subtle shadow under TV */}
        <div className="absolute -bottom-6 left-1/4 right-1/4 h-4 bg-black/10 rounded-full blur-md"></div>
      </div>
    </Card>
  );
} 