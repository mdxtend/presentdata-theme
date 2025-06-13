import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronUp, ChevronsUp, Calendar, Tag } from 'lucide-react'
import { FormattedDate } from '../Utility/date';

type DocTyps = {
    links?: {
        label: string
        url: string
    }[]
    publishedAt?: string
    title?: string
    url?: string
    tags?: string[]
    preview?: string
}

type Props<T extends DocTyps> = {
    item: T
    index: number | string;
}

type ListItemsProps<T extends DocTyps> = { items: T[] }

export const ListItem = <T extends DocTyps>({ item, index }: Props<T>) => {
    const [position, setPosition] = useState({ x: '50%', y: '50%' })
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = `${e.clientX - rect.left}px`
        const y = `${e.clientY - rect.top}px`
        setPosition({ x, y })
    }

    return (
        <div
            className="card p-5 h-full min-h-40 bg-border rounded-xl relative overflow-hidden"
            style={{ '--x': position.x, '--y': position.y } as React.CSSProperties}
            onMouseMove={handleMouseMove}
            key={index}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 h-7">
                    <div className="font-mono text-sm max-lg:text-xs capitalize">{item.tags?.[0]}</div>
                    {item.preview && (
                        <Link
                            href={item.preview}
                            target="_blank"
                            className="p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-background font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px]"
                        >
                            Preview
                        </Link>
                    )}
                </div>
                <Link
                    href={item.url ?? '#'}
                    className="font-serif tracking-wide text-xl max-lg:text-base hover:underline block"
                >
                    {item.title}
                </Link>
                <div className="mt-2 flex gap-3 items-center text-xs font-mono text-foreground-accent">
                    <span className="uppercase font-mono flex gap-1 items-center">
                        <Calendar className="w-4.5 h-4.5" /> {FormattedDate(item.publishedAt, 'month')}
                    </span>
                    <span className="flex gap-2 items-center">
                        {item.tags?.slice(1, 3).map((tag, index) => (
                            <Link
                                href={`/topic?s=${tag.trim().replace(/\s+/g, '+')}`}
                                key={index}
                                className="hover:underline hover:underline-offset-4 cursor-pointer flex gap-1 hover:text-primary-bright"
                            >
                                <Tag className="rotate-180 w-4.5 h-4.5" />
                                {tag}
                            </Link>
                        ))}
                    </span>
                </div>
                <div className="flex gap-2 mt-3 text-foreground-accent">
                    {item.links?.map((link, index) => (
                        <Link
                            key={index}
                            target="_blank"
                            href={link.url || '#'}
                            className="py-1 px-2 border-2 border-border rounded-full bg-background-code hover:bg-foreground-muted/40 hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-[11px] bg-background-secondary hover:bg-background-hover z-0" />
        </div>
    )
}

const ITEMS_PER_PAGE = 6

const ListItems = <T extends DocTyps>({ items }: ListItemsProps<T>) => {
    const [currentPage, setCurrentPage] = useState(0)

    if (!items.length) return

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
    const start = currentPage * ITEMS_PER_PAGE
    const paginatedItems = items.slice(start, start + ITEMS_PER_PAGE)
    const goToPage = (p: number) => setCurrentPage(Math.min(Math.max(p, 0), totalPages - 1))

    return (
        <>
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
                {paginatedItems.map((item, i) => {
                    const index = start + i
                    return (
                        <ListItem item={item} index={index} />
                    )
                })}
            </div>

            {/* pagination */}
            <div className="w-full max-lg:h-auto max-lg:px-4">
                <nav className="py-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
                    {/* Prev Group */}
                    <div className="flex flex-row-reverse items-center max-xs:flex-col max-xs:items-end gap-2 flex-wrap">
                        {['first', 'prev'].map(type => {
                            const isFirst = type === 'first'
                            const Icon = isFirst ? ChevronsUp : ChevronUp
                            const targetPage = isFirst ? 0 : currentPage - 1
                            const isDisabled = currentPage === 0
                            const content = (
                                <>
                                    <Icon className="-rotate-90 h-3 w-3" />
                                    {!isFirst && 'Prev'}
                                </>
                            )
                            const classes = 'flex items-center justify-center gap-1 p-2 rounded-lg text-foreground bg-background-code border border-border'
                            return isDisabled ? (
                                <div key={type} className={`opacity-50 select-none ${classes}`}>{content}</div>
                            ) : (
                                <button key={type} onClick={() => goToPage(targetPage)} className={`${classes} hover:bg-foreground/20 cursor-pointer`}>
                                    {content}
                                </button>
                            )
                        })}
                    </div>

                    {/* Page Numbers */}
                    <div className="flex flex-nowrap items-center gap-2 justify-center -mx-1">
                        {currentPage > 2 && <span className="text-sm select-none">...</span>}
                        {Array.from({ length: totalPages }).map((_, i) => {
                            if (
                                i === 0 ||
                                i === totalPages - 1 ||
                                Math.abs(currentPage - i) <= 1
                            ) {
                                const isActive = currentPage === i
                                return (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(i)}
                                        className={`text-sm font-mono px-2.5 py-1.5 rounded border cursor-pointer ${isActive
                                            ? 'bg-primary text-white border-primary-muted'
                                            : 'bg-background-code hover:bg-foreground/20 border-border text-foreground'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            } else if (
                                (i === currentPage - 2 && i > 1) ||
                                (i === currentPage + 2 && i < totalPages - 2)
                            ) {
                                return <span key={i} className="text-sm select-none">...</span>
                            }
                            return null
                        })}
                    </div>

                    {/* Next Group */}
                    <div className="flex flex-row items-center max-xs:flex-col max-xs:items-start gap-2 flex-wrap justify-end">
                        {['next', 'last'].map(type => {
                            const isLast = type === 'last'
                            const Icon = isLast ? ChevronsUp : ChevronUp
                            const targetPage = isLast ? totalPages - 1 : currentPage + 1
                            const isDisabled = currentPage >= totalPages - 1
                            const content = (
                                <span className="flex items-center gap-1">
                                    {!isLast && 'Next'}
                                    <Icon className="rotate-90 h-3 w-3" />
                                </span>
                            )
                            const baseClasses = 'flex items-center justify-center gap-1 p-2 rounded-lg text-foreground bg-background-code border border-border'
                            return isDisabled ? (
                                <div key={type} className={`opacity-50 select-none ${baseClasses}`}>{content}</div>
                            ) : (
                                <button key={type} onClick={() => goToPage(targetPage)} className={`${baseClasses} hover:bg-foreground/20 cursor-pointer`}>
                                    {content}
                                </button>
                            )
                        })}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default ListItems
