import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RestoreScroll = () => {
    const router = useRouter();

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const handleRouteChangeComplete = (url: string) => {
            const scrollPosition = sessionStorage.getItem(url);
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition, 10));
            }
        };

        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        handleRouteChangeComplete(router.asPath);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, [router]);

    return null;
};

export default RestoreScroll;
