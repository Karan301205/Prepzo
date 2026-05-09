import { useState, useEffect } from 'react';

/**
 * Tracks window width and exposes breakpoint helpers.
 * Re-renders only when the isMobile boundary (640px) is crossed.
 */
export function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { isMobile: width < 640, width };
}
