import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../Hooks/ThemeProvider';
import ToolTip from '../Presentdata/components/utility/ToolTip';

const ToggleTheme = () => {
    const { resolvedMode, toggleMode } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'D' && e.shiftKey) {
                toggleMode();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    return (
        <div
            className="relative flex gap-3 items-center px-4 group border-l border-border hover:border-b-foreground hover:cursor-pointer"
            onClick={toggleMode}
        >
            <ToolTip content="[SHIFT]+[D]" className="">
                <div className="w-5 flex items-center justify-center">
                    {resolvedMode === 'dark' ? (
                        <Sun className="text-foreground-accent hover:text-foreground" />
                    ) : (
                        <Moon className="text-foreground-accent hover:text-foreground" />
                    )}
                </div>
            </ToolTip>
        </div>
    );
};

export default ToggleTheme;
