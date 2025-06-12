import Link from "next/link";
import Copyright from "./Copyright";
import * as Contentlayer from 'contentlayer/generated';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, Search, UpArrow } from "@/components/Presentdata/Icons";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface SearchableDocument {
    type: string;
    title?: string;
    url: string;
    // OTHER PROPERTIES TO FILTER OR DISPLAY
}

const fuzzySearch = (query: string | undefined, documentsToSearch: SearchableDocument[]) => {
    const groupDocumentsByType = (docs: SearchableDocument[]) => {
        const groupedResults = new Map<string, { title: string; url: string }[]>();

        for (const doc of docs) {
            const docTitle = doc.title || '';
            if (!groupedResults.has(doc.type)) {
                groupedResults.set(doc.type, []);
            }
            groupedResults.get(doc.type)!.push({ title: docTitle, url: doc.url });
        }
        return Array.from(groupedResults.entries());
    };

    if (!query) {
        return groupDocumentsByType(documentsToSearch);
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredDocuments = documentsToSearch.filter(doc =>
        doc.title?.toLowerCase().includes(lowerCaseQuery) ||
        doc.url.toLowerCase().includes(lowerCaseQuery)
    );

    return groupDocumentsByType(filteredDocuments);
};

export function useSearchData(isActive: boolean, initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);
    const [data, setData] = useState<any>(null);
    const [filteredData, setFilteredData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive && !data) {
            setLoading(true);
            setTimeout(() => {
                const grouped = new Map<string, { title: string | undefined; url: string }[]>()

                for (const doc of Contentlayer.allDocuments) {
                    if (doc.type === 'Profile') continue;
                    if (!grouped.has(doc.type)) grouped.set(doc.type, [])
                    grouped.get(doc.type)!.push({ title: doc.title, url: doc.url })
                }
                setData(Array.from(grouped.entries()));
                setLoading(false);
                inputRef.current?.focus();
            }, 50);
        } else if (!isActive) {
            setData(null);
            setQuery('');
            setFilteredData(null);
        }
    }, [isActive, data]);

    useEffect(() => {
        if (!isActive || !data) return;

        setLoading(true);
        if (query) {
            setFilteredData(fuzzySearch(query, Contentlayer.allDocuments));
        } else {
            setFilteredData(data);
        }
        setLoading(false);
    }, [query, isActive, data]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    return { query, setQuery, filteredData, loading, inputRef, handleInputChange };
}

export const SearchBarModal = ({
    isOpen,
    onClose: onPropClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const initialQuery = searchParams.get('q') || '';
    const { query, setQuery, filteredData: data, loading, inputRef, handleInputChange } = useSearchData(isOpen, initialQuery);

    const [activeResultIndex, setActiveResultIndex] = useState(-1);
    const resultsRef = useRef<HTMLDivElement>(null);

    const flattenedData = useMemo(() => {
        if (!data) return [];
        return data.flatMap(([type, items]: [string, { title: string; url: string }[]]) =>
            items.map(item => ({ ...item, type }))
        );
    }, [data]);

    const onClose = useCallback(() => {
        setQuery('');
        setActiveResultIndex(-1);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('q');
        router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
        onPropClose();
    }, [onPropClose, pathname, router, searchParams, setQuery]);

    useEffect(() => {
        setActiveResultIndex(-1);
    }, [query, flattenedData.length]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        const resultsCount = flattenedData.length;

        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveResultIndex((prevIndex) =>
                (prevIndex + 1) % resultsCount
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveResultIndex((prevIndex) =>
                (prevIndex - 1 + resultsCount) % resultsCount
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeResultIndex !== -1 && flattenedData[activeResultIndex]) {
                router.push(flattenedData[activeResultIndex].url);
                onClose();
            } else if (query && inputRef.current) {
                onClose();
            }
        }
    }, [onClose, flattenedData, activeResultIndex, router, query, inputRef, isOpen]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            inputRef.current?.focus();
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown, inputRef]);

    useEffect(() => {
        if (activeResultIndex !== -1 && resultsRef.current) {
            const activeElement = resultsRef.current.children[activeResultIndex];
            if (activeElement) {
                activeElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                    behavior: 'smooth',
                });
            }
        }
    }, [activeResultIndex]);


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[399] max-lg:hidden bg-background-dark/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* modal */}
                    <motion.div
                        className="fixed z-[400] inset-0 flex items-center justify-center max-lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="bg-background-secondary rounded-2xl shadow-xl p-2 py-4 h-[35rem] w-[40rem] overflow-hidden flex flex-col"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative max-lg:hidden flex group w-full">
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 p-3 cursor-pointer">
                                    <Search className="w-5 h-5 group-hover:text-foreground smooth-animation !duration-100" />
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search..."
                                    id="main-search"
                                    value={query}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        const newSearchParams = new URLSearchParams(searchParams.toString());
                                        newSearchParams.set('q', encodeURIComponent(e.target.value));
                                        router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
                                    }}
                                    className="px-4 pl-10 w-full bg-transparent text-foreground placeholder-foreground-muted focus:ring-0 outline-none border-0 focus:outline-none text-xl transition-all duration-200 ease-in-out caret-primary"
                                />
                            </div>

                            <div className="overflow-y-auto h-full flex-grow" ref={resultsRef}>
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <span className="animate-pulse text-sm">Loading...</span>
                                    </div>
                                ) : (
                                    <>
                                        {flattenedData && flattenedData.length > 0 ? (
                                            <div className="text-lg flex flex-col text-foreground-accent">
                                                {data.map(([type, items]: [string, { title: string; url: string }[]]) => (
                                                    <div key={type}>
                                                        <div className="px-4 font-mono uppercase text-xs mt-3 mb-1 text-primary-bright">
                                                            {type}s
                                                        </div>
                                                        {items.map((item, idx) => {
                                                            const actualIndex = flattenedData.findIndex((fItem: { url: string; title: string; }) => fItem.url === item.url && fItem.title === item.title);
                                                            return (
                                                                <div
                                                                    key={item.url + idx}
                                                                    className={`px-4 py-2 min-h-10 border-l-3 rounded-r-lg hover:bg-background-tertiary border-background-secondary hover:border-primary group cursor-pointer ${activeResultIndex === actualIndex ? 'border-primary bg-background-tertiary' : 'border-background-secondary'}`}
                                                                    onClick={() => {
                                                                        router.push(item.url);
                                                                        onClose();
                                                                    }}
                                                                >
                                                                    <Link href={item.url}>
                                                                        <div className="line-clamp-1 group-hover:text-foreground">
                                                                            {item.title}
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center h-full">
                                                <span className="text-foreground-accent">No results found for "{query}"</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="-mx-2 -mb-4 flex items-center justify-between gap-4 text-xs p-2 bottom-0 font-mono border-t border-border">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-0.5">
                                            <span className="h-6 p-1.5 bg-background border border-border-muted flex items-center justify-center w-fit rounded-lg">
                                                <UpArrow className="w-3 h-3" />
                                            </span>
                                            <span className="h-6 rotate-180 p-1.5 bg-background border border-border-muted flex items-center justify-center w-fit rounded-lg">
                                                <UpArrow className="w-3 h-3" />
                                            </span>
                                        </div>
                                        <span className="text-foreground-accent">to navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="h-6 p-1.5 bg-background border border-border-muted flex items-center justify-center w-fit rounded-lg text-[8px]">
                                            ESC
                                        </span>
                                        <span className="text-foreground-accent">to close</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="h-6 p-1.5 bg-background border border-border-muted flex items-center justify-center w-fit rounded-lg text-[8px]">
                                            ENTER
                                        </span>
                                        <span className="text-foreground-accent">to select</span>
                                    </div>
                                </div>
                                <Copyright className="!gap-1.5 text-[9px] leading-3" />
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export const SearchBarModalMobile = ({
    onClickBurgerMenu,
    searchBarClick,
    setSearchBarClick,
}: {
    searchBarClick: boolean;
    onClickBurgerMenu: () => void;
    setSearchBarClick: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { query, setQuery, filteredData: data, loading, inputRef, handleInputChange } = useSearchData(searchBarClick);
    const router = useRouter();
    const [activeResultIndex, setActiveResultIndex] = useState(-1);
    const resultsRef = useRef<HTMLDivElement>(null);

    const toogleSearchIcon = useCallback(() => {
        setSearchBarClick(s => !s);
        onClickBurgerMenu();
        if (searchBarClick) {
            setQuery('');
            setActiveResultIndex(-1);
        }
    }, [onClickBurgerMenu, searchBarClick, setQuery, setSearchBarClick]);

    const flattenedData = useMemo(() => {
        if (!data) return [];
        return data.flatMap(([type, items]: [string, { title: string; url: string }[]]) =>
            items.map(item => ({ ...item, type }))
        );
    }, [data]);

    useEffect(() => {
        setActiveResultIndex(-1);
    }, [query, flattenedData.length]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!searchBarClick) return;

        const resultsCount = flattenedData.length;

        if (e.key === 'Escape') {
            toogleSearchIcon();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveResultIndex((prevIndex) =>
                (prevIndex + 1) % resultsCount
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveResultIndex((prevIndex) =>
                (prevIndex - 1 + resultsCount) % resultsCount
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeResultIndex !== -1 && flattenedData[activeResultIndex]) {
                router.push(flattenedData[activeResultIndex].url);
                toogleSearchIcon();
            } else if (query && inputRef.current) {
                toogleSearchIcon();
            }
        }
    }, [toogleSearchIcon, flattenedData, activeResultIndex, router, query, inputRef, searchBarClick]);

    useEffect(() => {
        if (searchBarClick) {
            window.addEventListener('keydown', handleKeyDown);
            inputRef.current?.focus();
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchBarClick, handleKeyDown, inputRef]);

    useEffect(() => {
        if (activeResultIndex !== -1 && resultsRef.current) {
            const activeElement = resultsRef.current.children[activeResultIndex];
            if (activeElement) {
                activeElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                    behavior: 'smooth',
                });
            }
        }
    }, [activeResultIndex]);

    return (
        <>
            {searchBarClick && (
                <main className="fixed w-full top-[57px] min-h-[calc(100dvh-57px)] bg-background hidden max-lg:block z-50">
                    <motion.div
                        className="m-40 max-lg:mx-5 max-lg:my-10 flex flex-col gap-8 items-end max-lg:items-start text-xl max-lg:text-2xl text-foreground-muted"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="relative hidden max-lg:flex border-b border-border group w-full">
                            <div className="absolute top-3.5 left-3">
                                <Search className={`w-5 h-5 smooth-animation stroke-current group-hover:text-foreground ${query.length > 0 ? 'text-foreground' : 'text-foreground-accent'}`} /> {/* Adjusted icon color based on query */}
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search..."
                                className="px-4 pl-10 w-full bg-transparent text-foreground placeholder-foreground-muted focus:ring-0 outline-none border-0 focus:outline-none text-xl transition-all duration-200 ease-in-out caret-primary"
                                value={query}
                                onChange={handleInputChange}
                                onFocus={() => { }}
                                onBlur={() => { }}
                            />
                        </div>
                        <div className="text-lg font-medium overflow-y-auto w-full flex-grow" ref={resultsRef}>
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <span className="animate-pulse text-sm">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    {flattenedData && flattenedData.length > 0 ? (
                                        <>
                                            {data.map(([type, items]: [string, { title: string; url: string }[]]) => (
                                                <div key={type}>
                                                    <div className="font-mono uppercase text-xs mt-3 text-primary-bright">{type}s</div>
                                                    {items.map((item, idx) => {
                                                        const actualIndex = flattenedData.findIndex((fItem: { url: string; title: string; }) => fItem.url === item.url && fItem.title === item.title);
                                                        return (
                                                            <div
                                                                key={item.url + idx}
                                                                className={`py-1 min-h-10 border-l-3 hover:bg-background-tertiary group cursor-pointer ${activeResultIndex === actualIndex ? 'border-primary bg-background-tertiary' : 'border-background'}`}
                                                                onClick={() => {
                                                                    router.push(item.url);
                                                                    toogleSearchIcon();
                                                                }}
                                                            >
                                                                <Link href={item.url}>
                                                                    <div className="line-clamp-1 group-hover:text-foreground">{item.title}</div>
                                                                </Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="flex justify-center items-center h-full">
                                            <span className="text-foreground-accent">No results found for "{query}"</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </main>
            )}
        </>
    )
}


const SearchBar = ({
    onClickBurgerMenu,
    setSearchBarClick,
    setIsSearchModalOpen,
    searchBarClick,
}: {
    onClickBurgerMenu: () => void;
    setSearchBarClick: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchBarClick: boolean;
}) => {
    const [desktopInputFocused, setDesktopInputFocused] = useState(false);

    const toogleSearchIcon = () => {
        setSearchBarClick(s => !s);
        onClickBurgerMenu();
    }

    return (
        <>
            <div className="flex max-lg:justify-between">

                {/* desktop search */}
                <div
                    className="relative max-lg:hidden flex border-l border-border group w-80 mr-[2px]"
                    onClick={() => setIsSearchModalOpen(true)}
                >
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 p-3 cursor-pointer">
                        <Search className={`w-5 h-5 group-hover:text-foreground smooth-animation !duration-100 ${desktopInputFocused ? 'text-foreground' : 'text-foreground-muted'}`} />
                    </div>
                    <input
                        type="text"
                        placeholder='Search...'
                        id="docs-search"
                        className="px-4 pl-10 w-full bg-transparent text-lg placeholder:select-none text-foreground placeholder-foreground-muted focus:ring-0 outline-none border-0 focus:outline-none transition-all duration-200 ease-in-out"
                        onFocus={() => setDesktopInputFocused(true)}
                        onBlur={() => setDesktopInputFocused(false)}
                        readOnly
                    />
                    <div className="absolute text-xs top-1/2 select-none -translate-y-1/2 right-2 px-4 py-0.5 flex gap-1 items-center justify-center cursor-pointer h-8 bg-background-secondary border border-border-muted rounded-2xl group">
                        <svg width={12} height={12} className="w-3 h-3 fill-foreground-accent group-hover:fill-foreground" viewBox="0 0 80 80">
                            <path d="M64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16S0,7.164,0,16s7.164,16,16,16h8v16h-8c-8.836,0-16,7.164-16,16s7.164,16,16,16c8.837,0,16-7.164,16-16v-8h16v7.98c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8v-8h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z" />
                        </svg>
                        <span className='text-foreground-accent group-hover:text-foreground font-mono mt-[1.5px]'>K</span>
                    </div>
                </div>

                {/* mobile search */}
                <div
                    className="hidden w-full relative max-lg:flex gap-3 items-center justify-center px-4 bg-transparent group border-l border-border hover:border-b-foreground smooth-animation overflow-hidden hover:cursor-pointer"
                    onClick={toogleSearchIcon}
                >
                    <div className={`absolute bottom-0 left-0 w-full bg-foreground transition-all duration-300 ease-in-out overflow-hidden ${searchBarClick ? 'h-full' : 'h-0'}`} />
                    <div className="w-5 flex items-center justify-center">
                        {searchBarClick ? (
                            <motion.div initial={{ scale: 1 }} animate={{ scale: 2 }} exit={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} className="mix-blend-difference">
                                <Close className="text-foreground mix-blend-difference w-3 h-3 z-10" />
                            </motion.div>
                        ) : <Search className="w-5 h-5 mix-blend-difference smooth-animation stroke-current group-hover:text-foreground text-foreground" />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchBar;