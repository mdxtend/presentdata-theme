import Link from 'next/link'
import React, { useState } from 'react'
import { ChevronUp, ChevronsUp } from 'lucide-react'

type DocTyps = { title: string; url?: string; tags?: string[]; preview?: string }
type ListItemsProps<T extends DocTyps> = { items: T[] }


const ITEMS_PER_PAGE = 6

const ListItems = <T extends DocTyps>({ items }: ListItemsProps<T>) => {
    const [positions, setPositions] = useState<{ x: string; y: string }[]>(
        items.map(() => ({ x: '50%', y: '50%' }))
    )
    const [currentPage, setCurrentPage] = useState(0)

    const handleMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = `${e.clientX - rect.left}px`
        const y = `${e.clientY - rect.top}px`
        setPositions(prev => {
            const copy = [...prev]
            copy[index] = { x, y }
            return copy
        })
    }

    if (!items.length) return <div>No Items Found.</div>

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
                        <div
                            key={index}
                            className="card p-5 h-full min-h-40 bg-border rounded-xl relative overflow-hidden"
                            style={
                                positions[index]
                                    ? ({ '--x': positions[index].x, '--y': positions[index].y } as React.CSSProperties)
                                    : undefined
                            }
                            onMouseMove={e => handleMouseMove(index, e)}
                        >
                            <div className="flex items-center justify-between mb-2 h-7 relative z-10">
                                <div className="font-mono text-sm max-lg:text-xs capitalize">{item.tags?.[0]}</div>
                                {item.preview && (
                                    <Link
                                        href={item.preview}
                                        target="_blank"
                                        className="p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-black font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px]"
                                    >
                                        Preview
                                    </Link>
                                )}
                            </div>
                            <Link
                                href={item.url ?? '#'}
                                className="font-serif tracking-wide text-xl max-lg:text-base hover:underline relative z-10 block"
                            >
                                {item.title}
                            </Link>
                            <div className="pointer-events-none absolute inset-px rounded-[11px] bg-background-secondary hover:bg-background-hover z-0" />
                        </div>
                    )
                })}
            </div>

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
                                <button key={type} onClick={() => goToPage(targetPage)} className={`${classes} hover:bg-foreground/20`}>
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
                                        className={`text-sm font-mono px-2.5 py-1.5 rounded border ${isActive
                                                ? 'bg-primary text-foreground border-primary-muted'
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
                                <button key={type} onClick={() => goToPage(targetPage)} className={`${baseClasses} hover:bg-foreground/20`}>
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
