import React, { useState } from 'react';

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Default placeholder images if none provided
  const galleryImages = images.length > 0 ? images : [
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Product+Image+1",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=1",
      alt: "Product image 1"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Product+Image+2",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=2",
      alt: "Product image 2"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Product+Image+3",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=3",
      alt: "Product image 3"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Product+Image+4",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=4",
      alt: "Product image 4"
    }
  ];

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative bg-gray-100 rounded-lg overflow-hidden"
        style={{ paddingBottom: '75%' }} // 4:3 aspect ratio
      >
        <img
          src={galleryImages[selectedImage].original}
          alt={galleryImages[selectedImage].alt}
          className="absolute inset-0 w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(selectedImage)}
        />
        <button
          className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-lg shadow-md text-gray-700 hover:bg-opacity-100 transition-colors"
          onClick={() => openLightbox(selectedImage)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative bg-gray-100 rounded-lg overflow-hidden
              ${selectedImage === index ? 'ring-2 ring-blue-600' : 'hover:opacity-75'} 
              transition-all duration-200`}
            style={{ paddingBottom: '100%' }} // 1:1 aspect ratio
          >
            <img
              src={image.thumbnail}
              alt={`${image.alt} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            onClick={closeLightbox}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
            onClick={previousImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
            onClick={nextImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main lightbox image */}
          <div 
            className="relative max-w-7xl max-h-[90vh] mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex].original}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-full max-h-[90vh] mx-auto"
              style={{ objectFit: 'contain' }}
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;