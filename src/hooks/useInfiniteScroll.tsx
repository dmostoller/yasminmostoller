// hooks/useInfiniteScroll.ts
import { useState, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsFetching(true);
            callback();
          }
        },
        { rootMargin: '100px' }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isFetching, callback]
  );

  return { isFetching, setIsFetching, lastElementRef };
}
