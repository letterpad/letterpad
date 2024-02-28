import { useEffect, useState } from 'react';

export const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const node = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, [ref, options]);

    useEffect(() => {
        if (isIntersecting) {
            setHasLoaded(true);
        }
    }, [isIntersecting])

    return { isIntersecting, hasLoaded };
};