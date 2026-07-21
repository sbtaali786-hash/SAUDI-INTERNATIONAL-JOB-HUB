import React, { useEffect, useRef } from 'react';

export const AdsterraBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous elements in case of React double rendering/re-mounting in Dev mode
    containerRef.current.innerHTML = '';

    // Create the exact Adsterra container div
    const adDiv = document.createElement('div');
    adDiv.id = 'container-2f57c3d6bde29efa1856776b8787dade';
    containerRef.current.appendChild(adDiv);

    // Create the exact Adsterra script tag
    const script = document.createElement('script');
    script.src = 'https://undergocutlery.com/2f57c3d6bde29efa1856776b8787dade/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    // Append script to containerRef so it runs only after the adDiv is inserted in the DOM
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup on unmount to prevent duplicate wrappers or elements
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center items-center" 
    />
  );
};
