import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderPlus, FolderUp, Upload } from "lucide-react";
import { useState } from "react";
import CreativeImageViewer, { type ImageFile } from "../components/CreativeImageViewer";
import UploadModal from "../components/UploadModal";
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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "updateImageDetails") {
    const imageId = formData.get("imageId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    // In a real app, you'd find and update the image in your database.
    // For this demo, we'll just log the action.
    console.log(`Simulating update for image: ${imageId}`);
    console.log(`New Title: ${title}`);
    console.log(`New Description: ${description}`);

    // Find the album and image to update (simulation)
    const album = photoAlbums.find(p => p.title === decodeURIComponent(params.folderId!));
    if (album) {
      // This part is tricky as we don't have a real DB or structured data here.
      // In a real scenario, you'd have a proper ID to find the image.
    }

    return json({ success: true, imageId, title, description });
  }

  return json({ success: false, error: "Invalid intent" }, { status: 400 });
}

export default function FolderRoute() {
  const { album } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  
  const [images, setImages] = useState<ImageFile[]>(() => 
    album.imageUrls.map((url, index) => ({
      _id: `${album.title}-${index}`,
      url: url,
      title: `${album.title} Image #${index + 1}`,
      description: `This is a sample description for image #${index + 1}. You can edit it in the viewer.`,
      filename: `${album.title.replace(/\s+/g, '_')}_${index + 1}.jpg`,
    }))
  );

  const [viewerState, setViewerState] = useState({ isOpen: false, startIndex: 0 });
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadComplete = (uploadedFiles: (File & { preview: string })[]) => {
    const newImages: ImageFile[] = uploadedFiles.map((file, index) => ({
      _id: `${album.title}-new-${images.length + index}`,
      url: file.preview,
      title: `New Image ${index + 1}`,
      description: '',
      filename: file.name,
    }));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleSaveImageDetails = async (imageId: string, title: string, description: string) => {
    // Optimistically update the UI
    setImages(prevImages =>
      prevImages.map(img =>
        img._id === imageId ? { ...img, title, description } : img
      )
    );

    // Submit data to the action
    fetcher.submit(
      { intent: "updateImageDetails", imageId, title, description },
      { method: "POST" }
    );
  };

  const handleOpenViewer = (index: number) => {
    setViewerState({ isOpen: true, startIndex: index });
  };

  const handleCloseViewer = () => {
    setViewerState({ isOpen: false, startIndex: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative dark:bg-gray-900 dark:text-gray-200">
      <header className="p-4 md:p-8 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">{album.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{images.length} photos</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Upload className="w-5 h-5 mr-3" />
          Upload Files
        </button>
      </header>

      <main className="p-4 md:p-8">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {images.map((image, index) => (
            <motion.div
              key={image._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => handleOpenViewer(index)}
            >
              <img src={image.url} alt={image.title || `Photo ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
              <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <p className="font-bold text-lg">{image.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      <CreativeImageViewer
        images={images}
        isOpen={viewerState.isOpen}
        startIndex={viewerState.startIndex}
        onClose={handleCloseViewer}
        onSaveImageDetails={handleSaveImageDetails}
      />
    </div>
  );
}
