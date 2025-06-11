import { MdxReactType } from "../../MDXComponents"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ToolTip from '@/components/Presentdata/PdataComponents/utility/ToolTip';
import { CheckIcon, CopyIcon, TextUnWrapIcon, TextWrapIcon } from '@/components/Presentdata/Icons';

export const a = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className='underline-offset-4 font-normal text-blue-500 hover:text-blue-600 focus-within:text-violet-500 visited:text-violet-500 visited:hover:text-violet-600 break-words text-base' target='_blank' {...props} />
)

export const code = (props: React.HTMLAttributes<HTMLElement>) => (
    <code data-theme="default" className='!my-0 py-0 overflow-x-auto overflow-y-clip' {...props} />
)

export const pre = (props: React.HTMLAttributes<HTMLPreElement>) => {
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
}

export const blockquote = ({ children, ...props }: MdxReactType) => {
    const colorMap = {
        tip: 'green', success: 'green',
        danger: 'red', error: 'red', fail: 'red', critical: 'red',
        caution: 'yellow', warning: 'yellow', warn: 'yellow', alert: 'yellow',
        secondary: 'gray', muted: 'gray', neutral: 'gray',
        info: 'green', note: 'blue',
    } as const

    let color = ''
    const updated = Array.isArray(children)
        ? children.map((c) => {
            const id = c?.props?.id?.toLowerCase?.()
            const tag = c?.type
            if (id && /^h[1-6]$/.test(tag)) {
                const match = Object.keys(colorMap).find(key => id.startsWith(key))
                if (match) {
                    color = colorMap[match as keyof typeof colorMap]
                    return {
                        ...c,
                        props: {
                            ...c.props,
                            className: `${c.props.className ?? ''} text-${color}-500`.trim(),
                        },
                    }
                }
            }
            return c
        })
        : children

    return (
        <blockquote {...props} className={`!border-${color}-500`}>
            {updated}
        </blockquote>
    )
}

export const table = (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className=' overflow-clip rounded-2xl border border-background-code !my-4'>
        <table className="bg-background redermdx-table !m-0" {...props}></table>
    </div>
)

export const ImageSvg = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 max-lg:mx-0 z-50`}><img className='!m-0' {...props} /></div>

export const Image = (props: { alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 -mx-[10%] max-lg:mx-0 z-50`}><div className=''><img className='!m-0' {...props} /></div><p className="w-full !my-1 text-center text-sm max-lg:text-xs font-mono text-foreground-muted !line-clamp-1">{props.alt}</p></div>

export const Image2 = (props: { alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) => <div className={`flex flex-col items-center justify-center my-6 max-md:my-3 max-lg:mx-0 z-50`}><div className=''><img className='!m-0' {...props} /></div><p className="w-full !my-1 text-center text-sm max-lg:text-xs font-mono text-foreground-muted !line-clamp-1">{props.alt}</p></div>
