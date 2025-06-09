import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ShareMenu from '@/components/Elements/ShareMenu';

export interface ImageViewerProps extends Omit<ImageProps, 'src' | 'alt'> {
    src: string | StaticImageData;
    alt: string;
    align?: 'left' | 'center' | 'right';
    maxWidthClass?: string;
    previewEnabled?: boolean;
}

const ImageViewer = ({ src, alt, className = '', align = 'center', maxWidthClass = 'max-w-md', previewEnabled = true, ...rest }: ImageViewerProps) => {
    const uniqueId = useId();
    const router = useRouter();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLDivElement>(null);
    const [isShareMenu, setIsShareMenu] = useState(false);

    if (!src) return null;

    let resolvedSrc: string | StaticImageData = src;
    if (typeof src === 'string') {
        if (src.startsWith('http') || src.startsWith('data:')) {
            resolvedSrc = src;
        } else {
            let basePath = router.asPath.split('#')[0];
            let base = '/data' + basePath;
            if (!base.endsWith('/')) base += '/';
            const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
            resolvedSrc = base + cleanSrc;
        }
    }


    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev);
    }, []);

    const closeFullscreen = useCallback(() => {
        setIsFullscreen(false);
        setIsShareMenu(false);
    }, []);

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        const href = typeof resolvedSrc === 'string' ? resolvedSrc : resolvedSrc.src;
        link.href = href;
        link.download = alt || `Preview Image ${href}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const handleClickOutside = (event: KeyboardEvent | MouseEvent) => {
            if (
                isFullscreen &&
                fullscreenRef.current &&
                !fullscreenRef.current.contains(event.target as Node) &&
                !closeButtonRef.current?.contains(event.target as Node)
            ) {
                closeFullscreen();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClickOutside(event);
            }

            if (
                isFullscreen &&
                ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)
            ) {
                event.preventDefault();
            }
        };

        // const preventScroll = (event: Event) => {
        //     if (isFullscreen) event.preventDefault();
        // };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleKeyDown);
        // window.addEventListener('wheel', preventScroll, { passive: false });
        // window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
            // window.removeEventListener('wheel', preventScroll);
            // window.removeEventListener('touchmove', preventScroll);
        };
    }, [isFullscreen, closeFullscreen]);

    const alignClasses =
        align === 'left' ? 'self-start' : align === 'right' ? 'self-end' : 'self-center';

    return (
        <div>
            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        className="fixed inset-0 z-[300] flex items-center justify-center"
                        initial={{
                            backdropFilter: "blur(0px)",
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                        }}
                        animate={{
                            backdropFilter: "blur(20px)",
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        exit={{
                            backdropFilter: "blur(0px)",
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ WebkitBackdropFilter: 'blur(0px)' }}
                        onClick={closeFullscreen}
                        id="image-modal-preview"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}

                        >
                            <motion.div
                                ref={fullscreenRef}
                                className="relative max-w-[90vw] rounded-lg shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                                layoutId={`image-preview-${src}-${uniqueId}`}
                            >
                                <motion.div
                                    className="rounded-md relative max-h-[90vh] lg:max-h-[80vh]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Image
                                        src={resolvedSrc}
                                        alt={alt || `Image Preview-${src}-${uniqueId}`}
                                        width={500}
                                        height={500}
                                        unoptimized
                                        quality={100}
                                        className={`rounded-xl border border-border object-contain w-full max-w-[90vw] z-[200] max-h-[90vh] lg:max-h-[80vh] ${className}`}
                                        {...rest}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Modal Controls */}
                            <motion.div className="h-20 fixed top-0 right-0 flex items-center gap-2 max-lg:gap-1.5 p-4 z-[350]"
                                ref={closeButtonRef}
                                onClick={(e) => e.stopPropagation()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <button
                                    className="h-12 py-3 px-4 max-lg:h-10 max-lg:px-4 flex gap-1.5 items-center justify-center text-foreground-accent hover:text-foreground font-mono uppercase text-sm max-lg:text-xs bg-background-secondary border border-border hover:bg-background-tertiary hover:border-border-tertiary rounded-xl cursor-pointer group"
                                    onClick={handleDownload}
                                    type="button"
                                >
                                    <svg
                                        width={20}
                                        height={20}
                                        className="stroke-current text-foreground-accent group-hover:text-foreground mb-1"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        strokeWidth="2"
                                        fill='none'
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <path d="M21 21H3M18 11L12 17L6 11M12 17V3" />
                                    </svg>

                                    <span>Download</span>
                                </button>

                                <button
                                    className="h-12 py-3 px-4 max-lg:h-10 max-lg:px-4 flex gap-1.5 items-center justify-center text-foreground-accent hover:text-foreground font-mono uppercase text-sm max-lg:text-xs bg-background-secondary border border-border hover:bg-background-tertiary hover:border-border-tertiary rounded-xl cursor-pointer group"
                                    type="button"
                                    onClick={() => setIsShareMenu(e => !e)}
                                    aria-label="Close preview"
                                >
                                    <svg
                                        width={20}
                                        height={20}
                                        className="stroke-current fill-current text-foreground-accent group-hover:text-foreground mb-1"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    // strokeWidth={4}
                                    >
                                        <path d="M31.2 14.2 41 24.1l-9.8 9.8V26.8L27 27c-6.8.3-12 1-16.1 2.4 3.6-3.8 9.3-6.8 16.7-7.5l3.6-.3V14.2zM28.3 6a1.2 1.2 0 0 0-1.1 1.3v10.6C12 19.4 2.2 29.8 2 40.3c0 .6.2 1 .6 1s.7-.3 1.1-1.1c2.4-5.4 7.8-8.5 23.5-9.2v9.7a1.2 1.2 0 0 0 1.1 1.3c.3 0 .6-.1.8-.4L45.6 25.1a1.5 1.5 0 0 0 0-2L29.1 6.4c-.2-.3-.5-.4-.8-.4z" />
                                    </svg>
                                    <span>Share</span>

                                </button>

                                <button
                                    className="h-12 py-3 px-4 max-lg:h-10 max-lg:px-4 text-foreground-accent hover:text-foreground font-mono uppercase text-sm max-lg:text-xs bg-background-secondary border border-border hover:bg-background-tertiary hover:border-border-tertiary rounded-xl cursor-pointer group"
                                    onClick={toggleFullscreen}
                                    type="button"
                                    aria-label="Close preview"
                                >
                                    <svg
                                        width={14}
                                        height={14}
                                        viewBox="0 0 56.326 56.326"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current fill-current text-foreground-accent group-hover:text-foreground"
                                        strokeWidth={4}
                                    >
                                        <path d="M477.613,422.087l25.6-25.6a1.5,1.5,0,0,0-2.122-2.121l-25.6,25.6-25.6-25.6a1.5,1.5,0,1,0-2.121,2.121l25.6,25.6-25.6,25.6a1.5,1.5,0,0,0,2.121,2.122l25.6-25.6,25.6,25.6a1.5,1.5,0,0,0,2.122-2.122Z" transform="translate(-447.328 -393.924)" />
                                    </svg>
                                </button>
                                {isShareMenu && (<div className='fixed top-16 right-0 flex flex-col p-4 z-[400]'>
                                    <div>
                                        <ShareMenu src={src} />
                                    </div>
                                </div>)}
                            </motion.div>


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Original Static Image (always visible) */}
            <motion.div
                className={`flex flex-col w-fit h-full cursor-pointer relative ${alignClasses}`}
                onClick={previewEnabled ? toggleFullscreen : undefined}
            >
                <motion.div layoutId={`image-preview-${src}-${uniqueId}`} className=''>
                    <Image
                        src={resolvedSrc}
                        alt={alt || `Image Preview-${src}-${uniqueId}`}
                        width={500}
                        height={500}
                        layout="fixed"
                        unoptimized
                        className={`${className}`}
                        {...rest}
                    />
                </motion.div>
                <div className=' absolute top-0 left-0 z-[-50] h-full'>
                    <Image
                        src={resolvedSrc}
                        alt={alt || `Image Preview-${src}-${uniqueId}`}
                        width={500}
                        height={500}
                        layout="fixed"
                        unoptimized
                        className={` ${className}`}
                        {...rest}
                    />
                </div>
            </motion.div>
        </div>

    );
};

export default ImageViewer;
