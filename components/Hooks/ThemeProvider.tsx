import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = "neon-green" | "neon-purple" | "neon-blue";
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    toggleMode: () => void;
    mode: ThemeMode;
    setMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("neon-green");
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window !== "undefined") {
            const savedMode = localStorage.getItem("mode") as ThemeMode | null;
            return savedMode && ["light", "dark", "system"].includes(savedMode) ? savedMode : "dark";
        }
        return "dark";
    });

    // retrieve theme from localStorage if available on initial render
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as Theme | null;
            if (savedTheme && ["neon-green", "neon-purple", "neon-blue"].includes(savedTheme)) {
                setTheme(savedTheme);
            }
        }
    }, []);

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("mode", newMode); 
            return newMode;
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            // current theme and mode to localStorage
            localStorage.setItem("theme", theme);
            localStorage.setItem("mode", mode);
        }

        // documentElement (html) class to match current theme and mode
        document.documentElement.classList.remove("neon-green", "neon-purple", "neon-blue", "light", "dark", "system");
        document.documentElement.classList.add(theme, mode);
    }, [theme, mode]);

    // storage events
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "mode") {
                const newMode = event.newValue as ThemeMode;
                if (newMode && ["light", "dark"].includes(newMode)) {
                    setMode(newMode);
                }
            }
            if (event.key === "theme") {
                const newTheme = event.newValue as Theme;
                if (newTheme && ["neon-green", "neon-purple", "neon-blue"].includes(newTheme)) {
                    setTheme(newTheme);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // cleanup on unmount
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleMode, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
