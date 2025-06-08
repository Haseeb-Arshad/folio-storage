// Photo album data
export const photoAlbums = [
  {
    title: 'Japan 2024',
    photoCount: 83,
    imageUrls: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1580135657198-980fa0c5d6f4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1574236170880-78841ee7265d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1536599018102-9f6700e1f1c9?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
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
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499856871958-5b9088d4decd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
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
      'https://images.unsplash.com/photo-1459679749680-18eb1eb37418?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
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
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1516815231560-8f41ec531527?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    ],
    stickerUrls: [
      'https://img.icons8.com/fluency/48/slr-camera.png',
      'https://img.icons8.com/office/40/negative-film.png'
    ],
  },
];

// Functions for managing photo albums (in a real app, these would interact with a backend)
export let photoAlbumsState = [...photoAlbums];

export const addPhotoAlbum = (newAlbum: {
  title: string;
  photoCount: number;
  imageUrls: string[];
  stickerUrls: string[];
}) => {
  photoAlbumsState = [...photoAlbumsState, newAlbum];
  return photoAlbumsState;
};

export const addPhotoToAlbum = (folderId: string, imageUrl: string) => {
  const folderIndex = photoAlbumsState.findIndex(
    album => album.title.toLowerCase().replace(/\s+/g, '-') === folderId
  );
  
  if (folderIndex !== -1) {
    const updatedAlbums = [...photoAlbumsState];
    updatedAlbums[folderIndex] = {
      ...updatedAlbums[folderIndex],
      imageUrls: [...updatedAlbums[folderIndex].imageUrls, imageUrl],
      photoCount: updatedAlbums[folderIndex].photoCount + 1
    };
    photoAlbumsState = updatedAlbums;
  }
  
  return photoAlbumsState;
};
