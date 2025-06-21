import React from 'react';

// A placeholder for the service icons. You can replace this with your actual ServiceIcons component.
const ServiceIcon = ({ service }) => {
  // A simple placeholder icon. You can expand this with your actual icons.
  const getIcon = (serviceName) => {
    switch (serviceName) {
      case 'notion':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#000"/>
            <path d="M8.5 7H10v10H8.5zM14 7h1.5v10H14zM11.25 7h1.5v10h-1.5z" fill="#000"/>
          </svg>
        );
      case 'slack':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.219 13.828h2.156a1.594 1.594 0 010 3.188H6.22a1.594 1.594 0 010-3.188zm0-3.188h2.156v2.156H6.22v-2.156zM10.172 6.22a1.594 1.594 0 013.188 0v7.609h-2.157a1.594 1.594 0 01-1.031-2.735l-2.156-2.156a1.594 1.594 0 012.156-2.718z" fill="#36C5F0"/>
            <path d="M10.172 10.172h-2.157v2.156h2.157v-2.156zm3.188 0h2.156a1.594 1.594 0 010 3.188h-2.157a1.594 1.594 0 010-3.188zm-1.031-3.953a1.594 1.594 0 012.719 1.032l2.156 2.156a1.594 1.594 0 01-1.031 2.734H12.33v-2.156h2.156a1.594 1.594 0 011.031-2.734z" fill="#2EB67D"/>
            <path d="M13.828 17.781h-2.156v-2.156h2.156v2.156zm0 3.188h-2.156a1.594 1.594 0 010-3.188h2.156a1.594 1.594 0 010 3.188zm3.953-1.032a1.594 1.594 0 01-2.719-1.031l-2.156-2.156a1.594 1.594 0 011.031-2.734h2.156v2.156h-2.156a1.594 1.594 0 01-1.031 2.734z" fill="#ECB22E"/>
            <path d="M17.781 13.828h2.156v-2.156h-2.156v2.156zm-3.188 0h-2.156v-2.156h2.156v2.156zm1.031 3.953a1.594 1.594 0 01-2.719-1.032l-2.156-2.156a1.594 1.594 0 011.031-2.734H15.67v2.156h-2.156a1.594 1.594 0 01-1.031 2.734z" fill="#E01E5A"/>
          </svg>
        );
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full"></div>;
    }
  };

  return (
    <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md">
      {getIcon(service)}
    </div>
  );
};

const NewFolderCard = ({ folder }) => {
  const { name, fileCount, services } = folder;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-64 h-56 flex flex-col justify-between transition-all hover:shadow-lg cursor-pointer">
      <div className="relative h-28">
        {/* Back folder shape */}
        <div className="absolute top-2 left-0 w-full h-24 bg-gray-200 rounded-lg"></div>
        {/* Front folder shape */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gray-700 rounded-lg">
          <div className="absolute top-0 left-4 w-24 h-4 bg-gray-700 rounded-t-md transform -translate-y-2"></div>
        </div>
        {/* Documents inside */}
        <div className="absolute top-4 left-4 w-52 h-20 bg-white rounded-md shadow-inner transform rotate-[-2deg]"></div>
        <div className="absolute top-5 left-6 w-48 h-20 bg-gray-50 rounded-md shadow-inner transform rotate-[1deg]"></div>

        {/* Service Icons */}
        <div className="absolute bottom-2 right-4 flex items-center space-x-[-8px]">
          {services && services.slice(0, 3).map((service, index) => (
            <ServiceIcon key={index} service={service} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-sm text-gray-500">{fileCount} Files</p>
      </div>
    </div>
  );
};

export default NewFolderCard;
