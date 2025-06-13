import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'neon-green' | 'neon-purple' | 'neon-blue';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  toggleMode: () => void;
  mode: ThemeMode;
  setMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  resolvedMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('neon-green');
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('mode') as ThemeMode | null;
      return savedMode && ['light', 'dark', 'system'].includes(savedMode) ? savedMode : 'dark';
    }
    return 'dark';
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const calculateResolvedMode = () => {
      if (mode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDark ? 'dark' : 'light';
      }
      return mode;
    };

    setResolvedMode(calculateResolvedMode());

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme && ['neon-green', 'neon-purple', 'neon-blue'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    }
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('mode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      localStorage.setItem('mode', mode);
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedMode);      // for light/dark
    root.setAttribute('data-color', theme);              // for neon-green, etc.
  }, [theme, mode, resolvedMode]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mode') {
        const newMode = event.newValue as ThemeMode;
        if (newMode && ['light', 'dark', 'system'].includes(newMode)) {
          setMode(newMode);
        }
      }
      if (event.key === 'theme') {
        const newTheme = event.newValue as Theme;
        if (newTheme && ['neon-green', 'neon-purple', 'neon-blue'].includes(newTheme)) {
          setTheme(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, mode, setMode, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
