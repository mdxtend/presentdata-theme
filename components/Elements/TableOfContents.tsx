import Link from 'next/link';
import { useRouter } from 'next/router';

const TableOfContents = ({ item }: { item: any }) => {
    if (!item) return;
    const router = useRouter();
    return (
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-400px)]">
            <div className="relative">
                <div className="font-mono text-xs uppercase text-foreground-highlight tracking-wide sticky top-0 w-full z-10">
                    {item.toc?.length > 0 && (<div className="bg-background w-full pb-2 px-6">On this Page</div>)}
                </div>
                <ul className="px-6 mt-4 font-in text-xs font-sans">
                    {item?.toc?.map((heading: { slug: string; level: string; text: string }) => (
                        <li key={heading.slug} className="py-1">
                            <Link
                                href={`#${heading.slug}`}
                                data-level={heading.level}
                                className="data-[level=two]:pl-0 data-[level=two]:pt-0 data-[level=three]:pl-1 max-sm:data-[level=three]:pl-2 flex items-center justify-start text-foreground-accent"
                            >
                                {heading.level === 'three' && <span className="flex w-1 h-1 rounded-full bg-background mr-2">{' '}</span>}
                                <span
                                    className={`relative text-xs group max-lg:hidden ${router.pathname.endsWith(`#${heading.slug}`) ? 'text-foreground' : 'hover:text-foreground'
                                        } tracking-wide`}
                                >
                                    <span
                                        className={`inline bg-gradient-to-b from-primary to-primary-light bg-no-repeat bg-left-bottom transition-[background-size] duration-500 ease-in-out hover:bg-[length:100%_2px] pb-0.5 smooth-animation ${router.pathname.endsWith(`#${heading.slug}`)
                                            ? 'bg-[length:100%_2px] text-primary-light'
                                            : 'bg-[length:0%_2px]'
                                            }`}
                                    >
                                        {heading.text}
                                </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TableOfContents