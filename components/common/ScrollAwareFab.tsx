import React, { useEffect, useRef, useState } from 'react';

interface ScrollAwareFabProps {
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
    className?: string;
}

const ScrollAwareFab: React.FC<ScrollAwareFabProps> = ({
    onClick,
    children,
    ariaLabel,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollTopRef = useRef(0);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            const target = event.target;

            if (target instanceof HTMLElement && target.hasAttribute('data-fab-scroll-container')) {
                const currentScrollTop = target.scrollTop;
                const scrollDelta = currentScrollTop - lastScrollTopRef.current;

                if (currentScrollTop <= 24) {
                    setIsVisible(true);
                } else if (scrollDelta > 8) {
                    setIsVisible(false);
                } else if (scrollDelta < -4) {
                    setIsVisible(true);
                }

                lastScrollTopRef.current = currentScrollTop;
                return;
            }

            if (target === document) {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
                const scrollDelta = currentScrollTop - lastScrollTopRef.current;

                if (currentScrollTop <= 24) {
                    setIsVisible(true);
                } else if (scrollDelta > 8) {
                    setIsVisible(false);
                } else if (scrollDelta < -4) {
                    setIsVisible(true);
                }

                lastScrollTopRef.current = currentScrollTop;
            }
        };

        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`fixed right-6 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-2xl transition-all duration-300 ease-out hover:bg-teal-600 ${isVisible ? 'pointer-events-auto translate-y-0 opacity-100 scale-100' : 'pointer-events-none translate-y-5 opacity-0 scale-95'} ${className}`}
        >
            {children}
        </button>
    );
};

export default ScrollAwareFab;
