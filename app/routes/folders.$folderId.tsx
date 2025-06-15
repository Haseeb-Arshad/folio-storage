import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import CreativeImageViewer from "../components/CreativeImageViewer";
import { photoAlbums } from "../data/photoAlbums";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const folderName = data?.album?.title ?? "Folder";
  return [
    { title: `Photography: ${folderName}` },
    { name: "description", content: `A collection of photos from ${folderName}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const folderId = params.folderId;
  if (!folderId) {
    throw new Response("Folder not found", { status: 404 });
  }

  const album = photoAlbums.find(p => p.title === decodeURIComponent(folderId));

  if (!album) {
    throw new Response("Album not found", { status: 404 });
  }

  return json({ album });
}

export default function FolderRoute() {
  const { album } = useLoaderData<typeof loader>();
  const [viewerState, setViewerState] = useState({ isOpen: false, startIndex: 0 });

  const imageFilesForViewer = album.imageUrls.map((url, index) => ({
    _id: `${album.title}-${index}`,
    url: url,
    title: `${album.title} #${index + 1}`,
    filename: `${album.title.replace(/\s+/g, '_')}_${index + 1}.jpg`,
  }));

  const handleOpenViewer = (index: number) => {
    setViewerState({ isOpen: true, startIndex: index });
  };

  const handleCloseViewer = () => {
    setViewerState({ isOpen: false, startIndex: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="p-4 md:p-8 border-b border-gray-200">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">{album.title}</h1>
        <p className="text-gray-500 mt-2">{album.photoCount} photos</p>
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.imageUrls.map((url, index) => (
            <div 
              key={index} 
              className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={() => handleOpenViewer(index)}
            >
              <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </main>

      <CreativeImageViewer
        images={imageFilesForViewer}
        isOpen={viewerState.isOpen}
        startIndex={viewerState.startIndex}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
