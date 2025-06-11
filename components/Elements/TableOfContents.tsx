import Link from 'next/link'
import { useEffect, useState } from 'react'

const TableOfContents = ({ item }: { item: any }) => {
    const [activeSlug, setActiveSlug] = useState<string | null>(null)

    useEffect(() => {
        if (!item?.toc?.length) return

        const handleScroll = () => {
            for (let i = item.toc.length - 1; i >= 0; i--) {
                const heading = document.getElementById(item.toc[i].slug)
                if (heading) {
                    const { top } = heading.getBoundingClientRect()
                    if (top <= 80) { // 800 - FORM BOTTOM
                        setActiveSlug(item.toc[i].slug)
                        return
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [item])

    if (!item) return null

    return (
        <div className="overflow-hidden overflow-y-auto max-h-[calc(100vh-400px)]">
            <div className="relative">
                <div className="font-mono text-sm uppercase text-foreground-highlight tracking-wide sticky top-0 w-full z-10">
                    {item.toc?.length > 0 && (
                        <div className="bg-background w-full pb-2 px-6">On this Page</div>
                    )}
                </div>
                <ul className="px-6 mt-4 font-in text-sm font-sans">
                    {item.toc.map((heading: { slug: string; level: string; text: string }) => {
                        const isActive = activeSlug === heading.slug
                        return (
                            <li key={heading.slug} className="py-1">
                                <Link
                                    href={`#${heading.slug}`}
                                    data-level={heading.level}
                                    className={`data-[level=two]:pl-0 data-[level=three]:pl-1 max-sm:data-[level=three]:pl-2 flex items-center text-foreground-accent`}
                                >
                                    {heading.level === 'three' && (
                                        <span className="flex w-1 h-1 rounded-full bg-background mr-2" />
                                    )}
                                    <span
                                        className={`relative group max-lg:hidden tracking-wide ${isActive ? 'text-primary-light' : 'hover:text-foreground'}`}
                                    >
                                        <span
                                            className={`inline bg-gradient-to-b from-primary to-primary-muted bg-no-repeat bg-left-bottom transition-[background-size] duration-500 ease-in-out hover:bg-[length:100%_2px] pb-0.5 smooth-animation ${
                                                isActive ? 'bg-[length:100%_2px] text-foreground' : 'bg-[length:0%_2px]'
                                            }`}
                                        >
                                            {heading.text}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default TableOfContents
