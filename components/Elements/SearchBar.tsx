import { Close, Search } from "@/components/Presentdata/Icons";
import { useState } from "react";
import { motion } from "framer-motion";

const SearchBar = ({
    onClickBurgerMenu,
    searchBarClick,
    setSearchBarClick,
    inputFocused,
    setInputFocused
}: {
    onClickBurgerMenu: () => void;
    searchBarClick: boolean;
    setSearchBarClick: React.Dispatch<React.SetStateAction<boolean>>;
    inputFocused: boolean;
    setInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const toogleSearchIcon = () => {
        setSearchBarClick(s => !s);
        onClickBurgerMenu();
    }

    return (
        <div className="flex max-lg:justify-between">

            {/* desktop search */}
            <div className="relative max-lg:hidden flex border-l border-border group w-80 mr-[2px]">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 p-3 cursor-pointer">
                    <Search className={`w-5 h-5 group-hover:text-foreground smooth-animation !duration-100 ${inputFocused ? 'text-foreground' : 'text-foreground-muted'}`} />
                </div>
                <input
                    type="text"
                    placeholder='Search...'
                    id="docs-search"
                    className="px-4 pl-10 w-full bg-transparent text-foreground placeholder-foreground-muted focus:ring-0 outline-none border-0 focus:outline-none group-hover:placeholder-foreground font-medium transition-all duration-200 ease-in-out"
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-2 p-4 px-4 flex gap-1 items-center justify-center cursor-pointer h-8 bg-background-secondary border border-border rounded-2xl group">
                    <svg className="w-3.5 h-3.5 fill-foreground-accent group-hover:fill-foreground" viewBox="0 0 80 80">
                        <path d="M64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16S0,7.164,0,16s7.164,16,16,16h8v16h-8c-8.836,0-16,7.164-16,16s7.164,16,16,16c8.837,0,16-7.164,16-16v-8h16v7.98c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8v-8h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z" />
                    </svg>
                    <span className='text-foreground-accent group-hover:text-foreground font-mono'>K</span>
                </div>
            </div>

            {/* mobile search */}
            <div className="hidden w-full relative max-lg:flex gap-3 items-center justify-center px-4 bg-transparent group border-l border-border hover:border-b-foreground smooth-animation overflow-hidden hover:cursor-pointer" onClick={toogleSearchIcon}>
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
    )
}

export default SearchBar;