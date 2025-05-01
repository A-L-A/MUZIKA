// src/utils/imagePreloader.js
import { useEffect } from 'react';

const COMMON_IMAGES = [
  // Hero images
  '/images/backgroundz/hero-background-1.jpg',
  '/images/backgroundz/hero-background-2.jpg',
  '/images/backgroundz/hero-background-3.jpg',
  
  // Event images
  '/images/eventz/concert.jpg',
  '/images/eventz/festival.jpg',
  '/images/eventz/karaoke.jpg',
  '/images/eventz/live-music.jpg',
  '/images/eventz/open-mic.jpg',
  '/images/eventz/party.jpg',
  
  // Artist images
  '/images/artistz/juma.jpg',
  '/images/artistz/wanjiku.jpg',
  '/images/artistz/esther.jpg',
  '/images/artistz/aminata.jpg',
  '/images/artistz/moussa.jpg',
  '/images/artistz/chantal.jpg',
  '/images/artistz/jean-claude.jpg',
  '/images/artistz/tariq.jpg',
];

const ImagePreloader = () => {
  useEffect(() => {
    const preloadImages = () => {
      COMMON_IMAGES.forEach(src => {
        const img = new Image();
        img.src = `${process.env.PUBLIC_URL}${src}`;
      });
    };

    // Preload on component mount
    preloadImages();

    // Also preload when window loads (as backup)
    window.addEventListener('load', preloadImages);

    return () => {
      window.removeEventListener('load', preloadImages);
    };
  }, []);

  return null;
};

export default ImagePreloader;