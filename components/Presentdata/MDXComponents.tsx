import ToolTip from '../Elements/ToolTip';
import Group, { GroupProps } from './PdataComponents/data/Group';
import { CheckIcon, CopyIcon, TextUnWrapIcon, TextWrapIcon } from './Icons';
import Code, { CodeProps, Tab, TabProps } from './PdataComponents/data/Code';
import React, { useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import PDFViewer, { PDFViewerProps } from './PdataComponents/viewer/viewers/PDFViewer';
import ImageViewer, { ImageViewerProps } from './PdataComponents/viewer/viewers/ImageViewer';

interface MdxReactType {
    children?: ReactNode;
}

type MDXComponents = {
    /** 
     * INCLUDE NEW CUSTOM COMPONENT TYPES HERE BEFOER DEFINING
     */
    DropCap: React.ComponentType<MdxReactType>;
    Image: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement> & { alt?: string }>;
    Image2: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement> & { alt?: string }>;
    ImageSvg: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
    a: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    pre: React.ComponentType<React.HTMLAttributes<HTMLPreElement>>;
    code: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
    table: React.ComponentType<React.HTMLAttributes<HTMLTableElement>>;
    ImageViewer: React.ComponentType<ImageViewerProps>;
    PDFViewer: React.ComponentType<PDFViewerProps>;
    Tab: React.ComponentType<TabProps>;
    Code: React.ComponentType<CodeProps>;
    Group: React.ComponentType<GroupProps>;
};

export const mdxComponents: MDXComponents = {
    DropCap: ({ children, ...props }: MdxReactType) => (
        <div className="first-letter:text-3xl max-sm:first-letter:text-5xl" {...props}>
            {children}
        </div>
    ),
    Image: (props: { alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 -mx-[10%] max-lg:mx-0 z-50`}><div className=''><img className='!m-0' {...props} /></div><p className="w-full !my-1 text-center text-sm max-lg:text-xs font-mono text-foreground-muted !line-clamp-1">{props.alt}</p></div>,
    Image2: (props: { alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 max-lg:mx-0 z-50`}><div className=''><img className='!m-0' {...props} /></div><p className="w-full !my-1 text-center text-sm max-lg:text-xs font-mono text-foreground-muted !line-clamp-1">{props.alt}</p></div>,
    ImageSvg: (props) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 max-lg:mx-0 z-50`}><img className='!m-0' {...props} /></div>,
    a: (props) => (
        <a className='underline-offset-4 font-normal text-blue-500 hover:text-blue-600 focus-within:text-violet-500 visited:text-violet-500 visited:hover:text-violet-600 break-words text-base' target='_blank' {...props} />
    ),
    pre: (props) => {
        const [isWrapped, setIsWrapped] = useState(false)
        const preRef = useRef<HTMLPreElement>(null)
        const [showControls, setShowControls] = useState(false);
        const useClipboard = () => {
            const [isCopied, setIsCopied] = useState(false);
            let timeoutId: ReturnType<typeof setTimeout> | undefined;

            const copyToClipboard = useCallback(async (text: string) => {
                try {
                    await navigator.clipboard.writeText(text);
                    setIsCopied(true);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    setIsCopied(false);
                }
            }, []);

            useEffect(() => {
                if (isCopied) {
                    timeoutId = setTimeout(() => {
                        setIsCopied(false);
                    }, 2000);
                }
                return () => {
                    if (timeoutId !== undefined) {
                        clearTimeout(timeoutId);
                    }
                };
            }, [isCopied]);

            return { isCopied, copyToClipboard };
        }
        const { isCopied, copyToClipboard } = useClipboard()

        useEffect(() => {
            const el = preRef.current
            if (!el) return

            const ancestorId = el.parentElement?.parentElement?.parentElement?.id
            setShowControls(!ancestorId?.startsWith('tab-'))
        }, [props.id])

        const handleCopy = useCallback(async () => {
            if (preRef.current) {
                await copyToClipboard(preRef.current.innerText)
            }
        }, [copyToClipboard])

        const handleToggleWrap = useCallback(() => {
            setIsWrapped(prev => !prev)
        }, [])

        return (
            <div className="relative max-w-3xl group my-4">
                {showControls && (
                    <div className="sticky top-16 max-lg:top-5 w-full pointer-events-none group-hover:flex hidden">
                        <div className="absolute bottom- top-2 right-1.5  px-2 flex gap-2 items-center bg-background-codeblock h-[2rem] pointer-events-auto rounded-lg">
                            <ToolTip content={isCopied ? "Copied!" : "Copy"}>
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
                            </ToolTip>

                            <ToolTip content={isWrapped ? "Unwrap" : "Wrap"}>
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
                            </ToolTip>
                        </div>
                    </div>
                )}
                <pre
                    ref={preRef}
                    id={props?.id}
                    className={`overflow-x-auto ${isWrapped ? 'whitespace-pre-wrap' : ''} rounded-lg`}
                    {...props}
                />
            </div>
        )
    },
    code: (props) => (
        <code className='!my-0 py-0 overflow-x-auto overflow-y-clip' {...props} />
    ),
    table: (props) => (
        <div className=' overflow-clip rounded border border-border my-4'>
            <table className="bg-background redermdx-table m-0" {...props}>
            </table>
        </div>
    ),
    ImageViewer,
    PDFViewer,
    Tab,
    Code,
    Group,
    /**
     * NEW CUSTOM FUNTION
     * 
        FunctionName: (props) => (
        <>
            // Function Logic //
        </>
        ),
     */
}