import Link from 'next/link';
import React, { useState } from 'react';


const ListItems = ({ items }: { items: any[] }) => {
    const [positions, setPositions] = useState(
        (items ?? []).map(() => ({ x: '50%', y: '50%' }))
    )

    const handleMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setPositions((prev) => {
            const copy = [...prev]
            copy[index] = { x: `${x}px`, y: `${y}px` }
            return copy
        })
    }

    if (!items) return <div>No Items Found.</div>

    return (
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
            {items.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="card p-5 h-full min-h-40 bg-border rounded-xl relative overflow-hidden"
                        style={{
                            '--x': positions[index].x,
                            '--y': positions[index].y,
                        } as React.CSSProperties}
                        onMouseMove={(e) => handleMouseMove(index, e)}
                    >
                        <div className="flex items-center justify-between mb-2 h-7 relative z-10">
                            <div className="font-mono text-sm max-lg:text-xs capitalize">{item.tags && item.tags[0]}</div>
                            {item.preview && (
                                <button className="p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-black font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px]">
                                    <Link href={item.preview || '#'} target='_blank'>Preview</Link>
                                </button>
                            )}
                        </div>
                        <Link
                            href={item.url}
                            // target='_blank'
                            className="font-serif tracking-wide text-xl max-lg:text-base hover:underline relative z-10 block"
                        >
                            {item.title}
                        </Link>
                        <div className="pointer-events-none absolute inset-px rounded-[11px] bg-background-secondary hover:bg-background-hover z-0" />
                    </div>
                )
            })}
        </div>
    )
}

export default ListItems
