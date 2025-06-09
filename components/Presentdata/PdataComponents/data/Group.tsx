import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, Settings, TextUnWrapIcon, TextWrapIcon } from '@/components/Presentdata/Icons';
import React, {
    useState,
    useId,
    ReactNode,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    memo
} from 'react';
import Tooltip from '@/components/Elements/ToolTip';

const COPY_SUCCESS_DURATION = 2000;
const ANIMATION_DURATION = 0.2;

export enum GroupType {
    SINGLE = 'single',
    MULTIPLE = 'multiple'
}

export interface TabProps {
    fileName: string;
    language: string;
    children: ReactNode;
}

export interface GroupProps {
    fileName: string;
    language: string;
    type?: GroupType | 'single' | 'multiple';
    children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
    className?: string;
    'data-testid'?: string;
}

const tabAnimationVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'fit-content' },
    exit: { opacity: 0, height: 0 }
};

export const Tab = memo<TabProps>(({ language, fileName, children }) => {
    return (
        <div>
            {children}
        </div>
    );
});

Tab.displayName = 'Tab';

// Custom hook for clipboard operations
const useClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (elementId: string) => {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with ID ${elementId} not found`);
                return false;
            }

            // Modern clipboard API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(element.textContent || '');
            } else {
                // Fallback for older browsers
                const range = document.createRange();
                range.selectNodeContents(element);
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('copy');
                    selection.removeAllRanges();
                }
            }

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }, []);

    return { isCopied, copyToClipboard };
};

// Custom hook for outside click detection
const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [callback]);

    return ref;
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 700);
        handleResize(); // initialize on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

// Main component with improved architecture
export const Group = memo<GroupProps>(({
    fileName,
    language,
    type = GroupType.SINGLE,
    children,
    className = '',
    'data-testid': testId
}) => {
    const uniqueId = useId();
    const [activeTab, setActiveTab] = useState(0);
    const [isWrapped, setIsWrapped] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettings, setIsSettings] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const { isCopied, copyToClipboard } = useClipboard();

    // Normalize children to always be an array
    const childrenArray = useMemo(() =>
        React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TabProps>[],
        [children]
    );

    const isMobile = useIsMobile();
    const isMultipleFiles = childrenArray.length > (isMobile ? 1 : 4);
    const currentTab = childrenArray[activeTab];

    // Close dropdown callback
    const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
    const closeSettings = useCallback(() => setIsSettings(false), []);
    const dropdownRef = useOutsideClick(closeDropdown);
    const settingsRef = useOutsideClick(closeSettings);

    // Handlers with improved error handling
    const handleCopy = useCallback(async () => {
        const elementId = `tab-${activeTab}-${uniqueId}`;
        await copyToClipboard(elementId);
    }, [activeTab, uniqueId, copyToClipboard]);

    const handleToggleWrap = useCallback(() => {
        setIsWrapped(prev => !prev);
    }, []);

    const handleTabChange = useCallback((index: number) => {
        if (index !== activeTab && index >= 0 && index < childrenArray.length) {
            setActiveTab(index);
            setIsDropdownOpen(false);
            setHasAnimated(true);
        }
    }, [activeTab, childrenArray.length]);

    // Keyboard navigation for accessibility
    const handleKeyDown = useCallback((event: React.KeyboardEvent, index?: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (typeof index === 'number') {
                handleTabChange(index);
            } else {
                setIsDropdownOpen(prev => !prev);
            }
        } else if (event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    }, [handleTabChange]);

    // Error boundary for malformed children
    if (!currentTab) {
        console.error('Group component: No valid Tab children found');
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">Error: No valid tabs found</p>
            </div>
        );
    }

    const iconSrc = `/packages/svgs/icons/${currentTab.props.language}.svg`;

    return (
        <div
            className={`relative flex flex-col gap-3  border-border-muted rounded-2xl group my-3 mt-5 ${className}`}
            data-testid={testId}
        >
            {/* Header with file selector */}
            <div className="flex flex-col items-start bg-background-darker relative">
                <div className="flex items-center justify-between w-full max-h-10 h-full">
                    {isMultipleFiles ? (
                        <div ref={dropdownRef} className="relative w-fit">
                            <button
                                className="flex items-center justify-between gap-2 cursor-pointer p-2 px-3 smooth-animation focus:outline-none rounded-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onKeyDown={handleKeyDown}
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="listbox"
                                aria-label="Select file"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ease-in-out text-foreground-accent ${isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-foreground-accent font-medium">
                                        {currentTab.props.fileName}
                                    </span>
                                </span>
                            </button>

                            {isDropdownOpen && (
                                <div
                                    className="absolute p-1 space-y-1 w-full min-w-40 bg-background-codeblock border border-border-muted shadow-lg -ml-[1px] rounded-2xl z-10"
                                    role="listbox"
                                    aria-label="File options"
                                >
                                    {childrenArray.map((child, index) => (
                                        <div className={`w-full flex whitespace-nowrap items-center rounded-[14px] cursor-pointer ${activeTab === index ? "bg-background-tertiary" : "hover:bg-background-tertiary"}`}>
                                            <button
                                                key={`${child.props.fileName}-${index}`}
                                                className={`flex items-center p-1.5 px-2.5 gap-1.5`}
                                                onClick={() => handleTabChange(index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                role="option"
                                                aria-selected={activeTab === index}
                                            >
                                                <Image
                                                    src={`/packages/svgs/icons/${child.props.language}.svg`}
                                                    alt={`${child.props.language} icon`}
                                                    width={18}
                                                    height={18}
                                                    className="!m-0"
                                                />
                                                <span className={`text-xs font-mono font-medium ${activeTab === index ? "text-foreground" : "text-foreground-accent "}`}>
                                                    {child.props.fileName}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex gap-[5px] rounded-t-[15px] overflow-hidden p-1'>
                            {childrenArray.map((child, index) => {
                                if (!React.isValidElement(child)) return null;

                                const { fileName, language } = child.props;

                                return (
                                    <div key={`${fileName}-${index}`} className={`w-fit flex items-center justify-center  rounded-lg cursor-pointer ${activeTab === index ? "bg-background-tertiary" : "hover:bg-background-tertiary"}`}
                                        onClick={() => handleTabChange(index)}
                                    >
                                        <div className="flex items-center p-1.5 px-2.5 gap-1">
                                            <span className={`text-xs font-mono font-medium w-full ${activeTab === index ? "text-foreground" : "text-foreground-accent "}`}>
                                                {fileName}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Group content */}
            <div className={`flex flex-col ${isWrapped ? 'wrap-text' : ''}`}>
                {childrenArray.map((child, index) =>
                    activeTab === index ? (
                        <div key={`${child.props.fileName}-${index}`} id={`tab-${index}-${uniqueId}`} className="w-full" >
                            {child.props.children}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
});

Group.displayName = 'Group';

export default Group;