import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Close, Search, XTwitter, Github } from "@/components/Presentdata/Icons";
import presentData from '@/public/data/presentdata.config'
import SearchBar from "../Elements/SearchBar";

const NAV_LINKS = [
    { href: "/about", label: "About" },
    { href: "/research", label: "Research" },
    { href: "/publications", label: "Publications" },
    { href: "/teaching", label: "Teaching" },
    { href: "/contact", label: "Contact" },
];

const SOCIALS = [
    { href: "https://github.com/CyberKavach/", icon: Github },
    { href: "https://x.com/CyberKavach/", icon: XTwitter },
];

// const HOVER_CONTENT: Record<string, React.ReactNode> = {
//     Tools: (
//         <div className="p-4">
//             <Link href="/encryption">Encryption</Link>
//         </div>
//     ),
//     Firewall: (
//         <div className="p-4">
//             <Link href="/waf">Web Application Firewall</Link>
//         </div>
//     )
// }

const Header = () => {
    const [inputFocused, setInputFocused] = useState(false);
    const [burgerMenuClick, setBurgerMenuClick] = useState(false);
    const [searchBarClick, setSearchBarClick] = useState(false);
    // const [activeTab, setActiveTab] = useState<string | null>(null)
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const isDocsPage = router.pathname.includes("docs");

    const closeBurgerMenu = () => {
        setBurgerMenuClick(false);
    }

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
                    <div className="max-w-7xl border border-border border-t-0 h-full w-full mx-auto flex items-center justify-between ">
                        <div className="h-full w-full flex items-center justify-between p-4">
                            <div className="w-fit max-xl:w-full flex items-center text-2xl select-none" onClick={() => burgerMenuClick && setBurgerMenuClick(false)}>
                                <Link href="/" className='flex whitespace-nowrap items-center justify-center font-serif tracking-wider'>
                                    <span className="">Walter White</span>
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
                                searchBarClick={searchBarClick}
                                setSearchBarClick={setSearchBarClick}
                                inputFocused={inputFocused}
                                setInputFocused={setInputFocused}
                            />
                            {/* <div className="flex max-xs:hidden gap-3 max-lg:gap-2 items-center justify-center w-fit max-lg:w-full px-4 max-lg:px-3 bg-background border-b border-r border-border font-medium smooth-animation">
                                {SOCIALS.map(({ href, icon: Icon }) => (
                                    <Link key={href} href={href} target="_blank">
                                        <Icon className="text-foreground-muted max-lg:text-foreground hover:text-foreground smooth-animation w-5 max-lg:w-4 h-5 max-lg:h-4" />
                                    </Link>
                                ))}
                            </div> */}

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

            {/* <AnimatePresence> */}
            {burgerMenuClick && (
                <motion.main
                    ref={modalRef}
                    className="absolute min-w-96 w-full top-[57px] min-h-[calc(100dvh-57px)] bg-background hidden max-lg:block z-50"
                // style={{ WebkitBackdropFilter: 'blur(40px)' }}
                >
                    <motion.div
                        className="m-40 my-20 max-lg:mx-10 max-lg:my-20 flex flex-col justify-center gap-8 max-lg:gap-4 items-end max-lg:items-start text-6xl max-lg:text-5xl font-medium text-foreground-muted "
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

            {searchBarClick && (
                <main className="absolute min-w-96 w-full top-[57px] min-h-[calc(100dvh-57px)] bg-background hidden max-lg:block z-50">
                    <motion.div className="m-40 max-lg:mx-5 max-lg:my-10 flex flex-col gap-8 items-end max-lg:items-start text-xl max-lg:text-2xl font-bold text-foreground-muted" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                        <div className="relative hidden max-lg:flex border-b border-border group w-full">
                            <div className="absolute top-2.5 left-3">
                                <Search className={`w-5 h-5 smooth-animation stroke-current group-hover:text-foreground ${inputFocused ? 'text-foreground' : 'text-foreground-accent'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search Docs..."
                                className="px-4 pl-10 w-full -mb-[1px] bg-background text-foreground placeholder-foreground-accent focus:outline-0 border-0 border-b border-foreground-accent focus:ring-0 focus:border-border focus:border-b-foreground focus:placeholder-foreground group-hover:placeholder-background font-medium smooth-animation"
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                            />
                        </div>
                    </motion.div>
                </main>
            )}

            {/* <div>
                <AnimatePresence>
                    {activeTab && (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            onMouseEnter={() => setActiveTab(activeTab)}
                            onMouseLeave={() => setActiveTab(null)}
                            className="fixed bg-background z-[90] w-full top-[56px] h-60 border-b border-border shadow-sm"
                        >
                            {HOVER_CONTENT[activeTab]}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div> */}
        </>
    );
};

export default Header;