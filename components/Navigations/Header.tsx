import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import presentData from '@/public/data/presentdata.config';
import { Menu, Close } from "@/components/Presentdata/Icons";
import SearchBar, { SearchBarModal, SearchBarModalMobile } from "../Elements/SearchBar";

const Header = () => {
    const [burgerMenuClick, setBurgerMenuClick] = useState(false);
    const [searchBarClick, setSearchBarClick] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeBurgerMenu = () => {
        setBurgerMenuClick(false);
    }

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
    }
    // const openSearchModal = () => {
    //     setIsSearchModalOpen(false);
    // }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if ((e.ctrlKey || e.metaKey) && k === 'k') e.preventDefault(), setIsSearchModalOpen(v => !v)
            else if (k === 'escape') setIsSearchModalOpen(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!modalRef.current?.contains(target) && !document.getElementById('burger-menu')?.contains(target)) {
                setBurgerMenuClick(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == 'Escape') {
                setBurgerMenuClick(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        };
    }, []);

    return (
        <>
            <div className="h-16 relative z-[100]  w-full">
                <header className="fixed top-0 left-0 h-16 w-full justify-items-center backdrop-blur-xl bg-background/80 border-b-0 border-border">
                    <div className="max-w-7xl border border-border border-t-0 max-xl:border-x-0 h-full w-full mx-auto flex items-center justify-between ">
                        <div className="h-full w-full flex items-center justify-between p-4">
                            <div className="w-fit max-xl:w-full flex items-center text-2xl select-none" onClick={() => burgerMenuClick && setBurgerMenuClick(false)}>
                                <Link href="/" className='flex whitespace-nowrap items-center justify-center font-serif tracking-wider'>
                                    <span className="">{presentData.siteMetaData.title}</span>
                                </Link>
                            </div>

                            {/* desktop navigations */}
                            <div className="w-full flex max-xl:hidden gap-6 items-center justify-end select-none whitespace-nowrap">
                                {presentData.header.navigationEnable ?
                                    (presentData.header.navigationEnable && (presentData.header.navigation.slice(0, 8).map(({ label, href }) => (
                                        <div key={label} className="h-full flex items-center justify-center">
                                            <Link href={href} className="flex gap-2 items-center hover:text-foreground tracking-wide font-medium  smooth-animation text-foreground-accent">{label}</Link>
                                        </div>
                                    ))))
                                    :
                                    (presentData.pages.slice(0, 8).map((page, index) => (
                                        <div key={index} className="h-full flex items-center justify-center">
                                            <Link href={page.slug} className="flex gap-2 items-center hover:text-foreground tracking-wide font-medium  smooth-animation text-foreground-accent">{page.title}</Link>
                                        </div>
                                    )))
                                }
                            </div>
                        </div>

                        <div className="flex max-lg:justify-between h-full">
                            <SearchBar
                                onClickBurgerMenu={closeBurgerMenu}
                                setSearchBarClick={setSearchBarClick}
                                searchBarClick={searchBarClick}
                                setIsSearchModalOpen={setIsSearchModalOpen}
                            />

                            <div
                                className={`relative hidden max-lg:flex gap-3 items-center px-4 bg-background group border-l border-border hover:border-b-foreground smooth-animation hover:cursor-pointer`}
                                id="burger-menu"
                                onClick={() => {
                                    setBurgerMenuClick(s => !s);
                                    setSearchBarClick(false);
                                }}
                            >
                                <div className={`absolute bottom-0 left-0 w-full bg-foreground transition-all duration-300 ease-in-out overflow-hidden ${burgerMenuClick ? 'h-full' : 'h-0'}`} />
                                <div className="w-5 flex items-center justify-center">
                                    {burgerMenuClick ? (
                                        <motion.div initial={{ scale: 1 }} animate={{ scale: 2 }} exit={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} className="mix-blend-difference">
                                            <Close className="text-foreground mix-blend-difference w-3 h-3 z-10" />
                                        </motion.div>
                                    ) : (
                                        <Menu className={`mix-blend-difference text-foreground-muted max-lg:text-foreground group-hover:text-foreground smooth-animation w-10 h-10  z-10`} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <SearchBarModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
            {/* <AnimatePresence> */}
            {burgerMenuClick && (
                <motion.main
                    ref={modalRef}
                    className="fixed w-full top-16 min-h-[calc(100dvh-57px)] bg-background hidden max-lg:block z-50"
                    // style={{ WebkitBackdropFilter: 'blur(40px)' }}
                >
                    <motion.div
                        className="m-40 my-20 max-lg:mx-4 max-lg:my-8 flex flex-col justify-center gap-8 max-lg:gap-4 items-end max-lg:items-start text-6xl max-lg:text-5xl font-medium text-foreground-muted "
                        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {presentData.header.navigationEnable ?
                            (presentData.header.navigationEnable && (presentData.header.navigation.slice(0, 8).map(({ label, href }) => (
                                <Link key={label} href={href} className="hover:text-foreground hover:max-lg:text-background smooth-animation" onClick={() => burgerMenuClick && setBurgerMenuClick(false)}>
                                    {label}
                                </Link>
                            ))))
                            :
                            (presentData.pages.slice(0, 8).map((page, index) => (
                                <Link key={index} href={page.slug} className="hover:text-foreground hover:max-lg:text-background smooth-animation" onClick={() => burgerMenuClick && setBurgerMenuClick(false)}>
                                    {page.title}
                                </Link>
                            )))
                        }
                    </motion.div>
                </motion.main>
            )}
            {/* </AnimatePresence> */}

            <SearchBarModalMobile
                onClickBurgerMenu={closeBurgerMenu}
                setSearchBarClick={setSearchBarClick}
                searchBarClick={searchBarClick}
            />
        </>
    );
};

export default Header;