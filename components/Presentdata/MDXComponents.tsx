import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, TextUnWrapIcon, TextWrapIcon } from './Icons';
import React, { useState, useId, ReactNode, useRef, useEffect } from 'react';
import ImageViewer, { ImageViewerProps } from './PdataComponents/viewer/viewers/ImageViewer';
import PDFViewer, { PDFViewerProps } from './PdataComponents/viewer/viewers/PDFViewer';
import Code, { CodeProps, Tab, TabProps } from './PdataComponents/data/Code';
import Group, { GroupProps } from './PdataComponents/data/Group';

interface FileNameProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: string;
    fileName: string;
    showLineNumbers?: boolean;
}

interface TabGroupProps {
    children: React.ReactElement<TabProps>[];
}

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
    FileName: React.ComponentType<FileNameProps>;
    // TabGroup: React.ComponentType<TabGroupProps>;
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
    pre: (props) => (
        <pre className='my-6 px-4 overflow-x-auto' {...props} />
    ),
    code: (props) => (
        <code className='!my-0 py-0 overflow-x-auto overflow-y-clip' {...props} />
    ),
    table: (props) => (
        <div className=' overflow-clip rounded border border-border my-4'>
            <table className="bg-background redermdx-table m-0" {...props}>
            </table>
        </div>
    ),
    FileName: ({ icon, fileName, children, ...props }: FileNameProps) => {
        const uniqueId = useId();
        const [isCopied, setIsCopied] = useState(false);
        const [isWraped, setIsWraped] = useState(false);

        const handleCopy = () => {
            const range = document.createRange();
            const element = document.getElementById(uniqueId);

            if (element) {
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
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        const handleWraped = () => {
            setIsWraped(value => !value);
        }

        return (
            <div className="relative flex flex-col items-start space-x-2 bg-background-codeblock border border-border group my-3" {...props}>
                <div className='bg-background-darker flex items-center justify-between w-full py-2'>
                    <div className='flex items-center justify-start px-3 gap-2'>
                        <span className="file-icon">
                            <Image src={`../packages/svgs/icons/${icon}.svg`} alt={icon} width={18} height={18} className='!m-0' />
                        </span>
                        <b className='text-xs font-mono text-foreground-accent'>{fileName}</b>
                    </div>
                </div>

                {/* copy code */}
                <div className='sticky top-24 max-lg:top-5 w-full flex'>
                    <div className='absolute bottom-0 right-0 p-0.5 px-1 flex items-center cursor-pointer gap-1 bg-background-darker h-[2.1rem]'>
                        <div className='h-full w-20 flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock px-2 p-2' onClick={handleWraped}>
                            {isWraped ? (<>
                                <TextUnWrapIcon className="text-foreground w-5 h-5" />
                                <span className='text-xs'>Unwrap</span></>
                            ) : (<>
                                <TextWrapIcon className="text-foreground w-5 h-5" />
                                <span className='text-xs'>Wrap</span></>
                            )}
                        </div>
                        <div className='h-full w-26 flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock px-2 p-1' onClick={handleCopy}>
                            {isCopied ? (<>
                                <CheckIcon className="text-primary w-5 h-5" />
                                <span className='text-xs'>Copied!</span></>
                            ) : (<>
                                <CopyIcon className="text-foreground w-5 h-5" />
                                <span className='text-xs'>Copy code</span></>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-full py-0 !m-0 overflow-x-auto' id={uniqueId}>
                    {children}
                </div>
            </div>
        );
    },
    // Tab: ({ icon, fileName, children }: TabProps) => {
    //     return (
    //         <div className="p-4 rounded-md bg-background-code">
    //             <div className="mb-2 flex items-center">
    //                 <div className="h-5 w-5 mr-2">{icon}</div>
    //                 <div className="text-sm">{fileName}</div>
    //             </div>
    //             <pre className="bg-background-code">
    //                 <code>{children}</code>
    //             </pre>
    //         </div>
    //     );
    // },
    // TabGroup: ({ children }: TabGroupProps) => {
    //     const uniqueId = useId();
    //     const [activeTab, setActiveTab] = useState(0);
    //     const [isCopied, setIsCopied] = useState(false);
    //     const [isWraped, setIsWraped] = useState(false);
    //     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    //     const [hasSwitchedTab, setHasSwitchedTab] = useState(false);
    //     const dropdownRef = useRef<HTMLDivElement>(null);

    //     const handleCopy = () => {
    //         const elementId = `tab-${activeTab}-${uniqueId}`;
    //         const element = document.getElementById(elementId);

    //         if (element) {
    //             const range = document.createRange();
    //             range.selectNodeContents(element);
    //             const selection = window.getSelection();
    //             if (selection) {
    //                 selection.removeAllRanges();
    //                 selection.addRange(range);
    //                 document.execCommand('copy');
    //                 selection.removeAllRanges();
    //             }
    //         }

    //         setIsCopied(true);
    //         setTimeout(() => {
    //             setIsCopied(false);
    //         }, 2000);
    //     };

    //     const handleWraped = () => {
    //         setIsWraped(value => !value);
    //     }

    //     const handleTabChange = (index: number) => {
    //         setActiveTab(index);
    //         setIsDropdownOpen(false);
    //     };

    //     useEffect(() => {
    //         if (!hasSwitchedTab) {
    //             setHasSwitchedTab(true);
    //         }
    //         const handleClickOutside = (event: MouseEvent) => {
    //             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //                 setIsDropdownOpen(false);
    //             }
    //         };
    //         document.addEventListener('mousedown', handleClickOutside);
    //         return () => {
    //             document.removeEventListener('mousedown', handleClickOutside);
    //         };
    //     }, [activeTab]);

    //     return (
    //         <>
    //             <div className='relative bg-background-codeblock border border-border group my-3'>
    //                 <div className="flex flex-col items-start bg-background-darker relative">
    //                     <div className='flex items-center justify-between w-full'>

    //                         {/* dropdown */}
    //                         <div ref={dropdownRef} className="relative w-fit">
    //                             <div
    //                                 className="flex items-center justify-between gap-2 cursor-pointer p-2 px-3 smooth-animation"
    //                                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    //                             >
    //                                 <span className="flex items-center gap-2">
    //                                     <Image
    //                                         src={`../packages/svgs/icons/${children[activeTab].props.icon}.svg`}
    //                                         alt={children[activeTab].props.icon}
    //                                         width={18}
    //                                         height={18}
    //                                         className="!m-0"
    //                                     />
    //                                     <b className="text-xs font-mono text-foreground-accent">{children[activeTab].props.fileName}</b>
    //                                 </span>
    //                                 <svg
    //                                     className={`w-4 h-4 transition-transform duration-200 ease-in-out text-foreground-accent ${isDropdownOpen ? 'rotate-180' : ''}`}
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     fill="none"
    //                                     viewBox="0 0 24 24"
    //                                     stroke="currentColor"
    //                                 >
    //                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    //                                 </svg>
    //                             </div>
    //                             {isDropdownOpen && (
    //                                 <div className="absolute min-w-40 w-full bg-background-codeblock border border-border shadow-lg -ml-[1px]">
    //                                     {React.Children.map(children, (child, index) => (
    //                                         <div
    //                                             key={index}
    //                                             className={`flex items-center gap-2 p-2 px-3 cursor-pointer ${activeTab === index ? 'bg-background-secondary' : ''}`}
    //                                             onClick={() => handleTabChange(index)}
    //                                         >
    //                                             <Image
    //                                                 src={`../packages/svgs/icons/${child.props.icon}.svg`}
    //                                                 alt={child.props.icon}
    //                                                 width={18}
    //                                                 height={18}
    //                                                 className="!m-0"
    //                                             />
    //                                             <b className="text-xs font-mono text-foreground-accent">{child.props.fileName}</b>
    //                                         </div>
    //                                     ))}
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* copy code */}
    //                 <div className='sticky top-24 max-lg:top-5 w-full flex'>
    //                     <div className='absolute bottom-0 right-0 p-0.5 px-1 flex items-center cursor-pointer gap-1 bg-background-darker h-[2.1rem]'>
    //                         <div className='h-full w-20 flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock px-2 p-2' onClick={handleWraped}>
    //                             {isWraped ? (<>
    //                                 <TextUnWrapIcon className="text-foreground w-5 h-5" />
    //                                 <span className='text-xs'>Unwrap</span></>
    //                             ) : (<>
    //                                 <TextWrapIcon className="text-foreground w-5 h-5" />
    //                                 <span className='text-xs'>Wrap</span></>
    //                             )}
    //                         </div>
    //                         <div className='h-full w-26 flex items-center justify-center gap-1 border border-background-codeblock bg-background-codeblock px-2 p-1' onClick={handleCopy}>
    //                             {isCopied ? (<>
    //                                 <CheckIcon className="text-primary w-5 h-5" />
    //                                 <span className='text-xs'>Copied!</span></>
    //                             ) : (<>
    //                                 <CopyIcon className="text-foreground w-5 h-5" />
    //                                 <span className='text-xs'>Copy code</span></>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* code block */}
    //                 <div className={`flex flex-col items-start bg-background-primary group overflow-x-auto overflow-y-hidden ${isWraped ? "wrap-text" : ""}`}>
    //                     <AnimatePresence>
    //                         {React.Children.map(children, (child, index) =>
    //                             activeTab === index && (
    //                                 <motion.div
    //                                     key={index}
    //                                     initial={hasSwitchedTab ? { opacity: 0, height: 0 } : {}}
    //                                     animate={hasSwitchedTab ? { opacity: 1, height: 'fit-content' } : {}}
    //                                     exit={hasSwitchedTab ? { opacity: 0, height: 0 } : {}}
    //                                     transition={{ duration: 0.2, ease: 'linear' }}
    //                                     className="w-full"
    //                                     id={`tab-${index}-${uniqueId}`}
    //                                 >
    //                                     {child.props.children}
    //                                 </motion.div>
    //                             )
    //                         )}
    //                     </AnimatePresence>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // },
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