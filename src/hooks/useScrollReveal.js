import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal(dependencies = []) {
  const location = useLocation();

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });
    
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
    };

    const timer = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname, ...dependencies]);
}
