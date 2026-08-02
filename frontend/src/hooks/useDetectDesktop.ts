import { useEffect, useState } from 'react';

const desktopMediaQuery = '(min-width: 768px)';
const getIsDesktop = (currentWindow: Window) => currentWindow.matchMedia(desktopMediaQuery).matches;

export const useDetectDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => (typeof window === 'undefined' ? false : getIsDesktop(window)));

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery);
    const updateIsDesktop = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', updateIsDesktop);
    return () => mediaQuery.removeEventListener('change', updateIsDesktop);
  }, []);

  return isDesktop;
};
