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
          // Optional: remove in-view if you want it to animate out when scrolling up
          entry.target.classList.remove('in-view');
        }
      });
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-zoom');
      elements.forEach(el => intersectionObserver.observe(el));
    };

    // Initial observation
    observeElements();

    // Use MutationObserver to watch for dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReobserve = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldReobserve = true;
        }
      });
      if (shouldReobserve) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname, ...dependencies]);
}
