import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts the pathname from the current location.
  const { pathname } = useLocation();

  // This effect runs every time the pathname changes.
  useEffect(() => {
    // Scrolls the window to the top left corner.
    window.scrollTo(0, 0);
  }, [pathname]); // The effect depends on the pathname.

  // This component does not render anything to the screen.
  return null;
};

export default ScrollToTop;