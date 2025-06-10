import Image from 'next/image';
import Tooltip from '@/components/Elements/ToolTip';
import React, { useState, useId, ReactNode, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { CheckIcon, CopyIcon, Settings, TextUnWrapIcon, TextWrapIcon } from '@/components/Presentdata/Icons';

const COPY_SUCCESS_DURATION = 2000;

export enum CodeType {
    SINGLE = 'single',
    MULTIPLE = 'multiple'
}

export interface TabProps {
    fileName: string;
    language: string;
    children: ReactNode;
}

export interface CodeProps {
    fileName: string;
    language: string;
    type?: CodeType | 'single' | 'multiple';
    children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
    className?: string;
    'data-testid'?: string;
}

export const Tab = memo<TabProps>(({ language, fileName, children }) => {
    return (
        <div>
            {children}
        </div>
    );
});

Tab.displayName = 'Tab';

export const useClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (elementId: string) => {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with ID ${elementId} not found`);
                return false;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(element.textContent || '');
            } else {
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

export const useOutsideClick = (callback: () => void) => {
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

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 700);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

export const Code = memo<CodeProps>(({
    fileName,
    language,
    type = CodeType.SINGLE,
    children,
    className = '',
    'data-testid': testId
}) => {
    const uniqueId = useId();
    const [activeTab, setActiveTab] = useState(0);
    const [isWrapped, setIsWrapped] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettings, setIsSettings] = useState(false);

    const { isCopied, copyToClipboard } = useClipboard();

    const childrenArray = useMemo(() =>
        React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TabProps>[],
        [children]
    );

    const isMobile = useIsMobile();
    const isMultipleFiles = childrenArray.length > (isMobile ? 1 : 4);
    const currentTab = childrenArray[activeTab];

    const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
    const closeSettings = useCallback(() => setIsSettings(false), []);
    const dropdownRef = useOutsideClick(closeDropdown);
    const settingsRef = useOutsideClick(closeSettings);

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
        }
    }, [activeTab, childrenArray.length]);

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

    if (!currentTab) {
        console.error('Code component: No valid Tab children found');
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">Error: No valid tabs found</p>
            </div>
        );
    }

    const iconSrc = `/packages/svgs/icons/${currentTab.props.language}.svg`;

    return (
        <div
            className={`relative bg-background-codeblock border border-border-muted rounded-2xl group my-3 ${className}`}
            data-testid={testId}
        >
            {/* header with file selector */}
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
                                <span className="flex items-center gap-2">
                                    <Image
                                        src={iconSrc}
                                        alt={`${currentTab.props.language} icon`}
                                        width={18}
                                        height={18}
                                        className="!m-0"
                                    />
                                    <span className="text-xs font-mono text-foreground-accent font-medium">
                                        {currentTab.props.fileName}
                                    </span>
                                </span>
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
                            </button>

                            {isDropdownOpen && (
                                <div
                                    className="absolute p-1 space-y-1 w-fit bg-background-codeblock border border-border-muted shadow-lg -ml-[1px] rounded-b-2xl z-10"
                                    role="listbox"
                                    aria-label="File options"
                                >
                                    {childrenArray.map((child, index) => (
                                        <div className={`w-full flex items-center justify-start rounded-lg cursor-pointer ${activeTab === index ? "bg-background-tertiary" : "hover:bg-background-tertiary"}`}>
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
                                                <span className={`text-xs font-mono font-medium w-full ${activeTab === index ? "text-foreground" : "text-foreground-accent "}`}>
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
                                    <div key={`${fileName}-${index}`} className={`w-fit flex items-center justify-center  rounded-[12px] ${childrenArray.length > 1 ? `${activeTab === index ? "bg-background-tertiary" : "hover:bg-background-tertiary cursor-pointer"}` : ``}`}
                                        onClick={() => handleTabChange(index)}
                                    >
                                        <div className="flex items-center p-1.5 px-2.5 gap-1">
                                            {language && (<Image
                                                src={`/packages/svgs/icons/${language}.svg`}
                                                alt={`${language} icon`}
                                                width={18}
                                                height={18}
                                                className="!m-0"
                                            />)}
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

            {/* Control buttons */}
            <div className="sticky z-10 top-24 max-lg:top-5 w-full flex pointer-events-none">
                <div className="absolute bottom-1 max-lg:bottom-0 right-0 m-0.5 mx-1.5 px-2 flex gap-2 items-center bg-background-codeblock h-[2rem] pointer-events-auto rounded-lg">
                    <Tooltip content={isCopied ? "Copied!" : "Copy"}>
                        <button
                            className="h-[2rem] w-fit flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock focus:outline-none transition-colors rounded-lg"
                            onClick={handleCopy}
                            aria-label="Copy code to clipboard"
                        >
                            {isCopied ? (
                                <>
                                    <CheckIcon className="text-primary w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="text-foreground w-5 h-5" />
                                </>
                            )}
                        </button>
                    </Tooltip>

                    <Tooltip content={isWrapped ? "Unwrap" : "Wrap"}>
                        <button
                            className="h-[2rem] w-fit flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock focus:outline-none transition-colors rounded-lg"
                            onClick={handleToggleWrap}
                            aria-label={isWrapped ? 'Unwrap text' : 'Wrap text'}
                        >
                            {isWrapped ? (
                                <>
                                    <TextUnWrapIcon className="text-foreground w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <TextWrapIcon className="text-foreground w-5 h-5" />
                                </>
                            )}
                        </button>
                    </Tooltip>

                    <div ref={settingsRef} className="relative w-fit">
                        <Tooltip content={"settings"}>
                            <button
                                className="h-[2rem] w-fit flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock focus:outline-none transition-colors rounded-lg"
                                onClick={() => setIsSettings(!isSettings)}
                                aria-label="Code Settings"
                            >
                                <Settings className={`w-4 h-4 mt-px`} />
                            </button>
                        </Tooltip>
                        {isSettings && (
                            <div
                                className="absolute top-9 -right-3 p-1 space-y-1 w-full min-w-40 bg-background-codeblock border border-border-muted shadow-lg mr-px rounded-2xl z-[300] overflow-hidden"
                                role="listbox"
                                aria-label="File options"
                            >
                                {childrenArray.map((child, index) => (
                                    <div className={`w-full flex items-center justify-start rounded-lg cursor-pointer ${activeTab === index ? "bg-background-tertiary" : "hover:bg-background-tertiary"}`}>
                                        <button
                                            key={`${child.props.fileName}-${index}`}
                                            className={`w-full flex items-center p-1.5 px-2.5 gap-1.5`}
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
                                            <span className={`text-xs font-mono font-medium w-full  ${activeTab === index ? "text-foreground" : "text-foreground-accent "}`}>
                                                {child.props.fileName}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Code content */}
            <div className={`flex flex-col items-start bg-background-primary group overflow-x-auto overflow-y-hidden rounded-b-2xl ${isWrapped ? 'wrap-text' : ''}`}>
                {childrenArray.map((child, index) =>
                    activeTab === index ? (
                        <div className="w-full" key={`${child.props.fileName}-${index}`} id={`tab-${index}-${uniqueId}`}>
                            {child.props.children}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
});

Code.displayName = 'Code';

export default Code;