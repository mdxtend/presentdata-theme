import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SaveScroll = () => {
    const router = useRouter();

    useEffect(() => {
        const saveScrollPosition = () => {
            sessionStorage.setItem(router.asPath, window.scrollY.toString());
        };

        window.addEventListener('scroll', saveScrollPosition);
        window.addEventListener('beforeunload', saveScrollPosition);
        router.events.on('routeChangeStart', saveScrollPosition);

        return () => {
            window.removeEventListener('scroll', saveScrollPosition);
            window.removeEventListener('beforeunload', saveScrollPosition);
            router.events.off('routeChangeStart', saveScrollPosition);
        };
    }, [router]);

    return null;
};

export default SaveScroll;
