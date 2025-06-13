import Link from 'next/link'
import { useMemo } from 'react'
import { ChevronUp, ChevronsUp } from 'lucide-react'

export default function Pagination({
    currentId,
    typeName,
    documents
}: {
    currentId: string
    typeName: string
    documents: any[]
}) {
    const currentParts = currentId.split('/')
    const currentDir = currentParts.slice(0, -1).join('/')

    const siblings = useMemo(() => {
        return documents
            .filter(d => {
                const parts = d._id.split('/')
                const dir = parts.slice(0, -1).join('/')
                return dir === currentDir
            })
            .sort((a, b) => {
                const isIndexA = a._id.endsWith('/index.mdx')
                const isIndexB = b._id.endsWith('/index.mdx')
                if (isIndexA) return -1
                if (isIndexB) return 1
                return a._id.localeCompare(b._id)
            })
    }, [documents, currentId])

    const index = siblings.findIndex(d => d._id === currentId)
    const pageNumber = index + 1
    const totalPages = siblings.length

    if (index === -1 || totalPages <= 1) return null
    const getLinkByIndex = (i: number) => siblings[i]?._raw?.flattenedPath ? `/${siblings[i]._raw.flattenedPath}` : '#'

    const pageButtons = []
    const leftEdge = Math.max(0, index - 1)
    const rightEdge = Math.min(totalPages - 1, index + 1)

    for (let i = leftEdge; i <= rightEdge; i++) {
        pageButtons.push(
            <Link
                key={i}
                href={getLinkByIndex(i)}
                className={`p-1.5 px-2.5 rounded cursor-pointer ${i === index
                    ? 'bg-primary-muted text-foreground'
                    : 'text-forground bg-background-code border border-border hover:bg-foreground/20'
                    }`}
            >
                {i + 1}
            </Link>
        )
    }

    if (totalPages <= 1) return

    return (
        <div className="pb-10 w-full h-28 max-lg:h-auto max-lg:px-4">
            <nav className="py-6 w-full flex flex-nowrap items-start max-lg:items-center max-xs:items-start justify-center gap-3 max-lg:gap-3 font-mono text-xs">
                {/* Prev Group */}
                <div className="flex flex-col max-lg:flex-row-reverse max-lg:items-center max-xs:flex-col max-xs:items-end items-end gap-2 flex-wrap">
                    {["first", "prev"].map((type) => {
                        const isFirst = type === "first";
                        const isDisabled = index === 0;
                        const Icon = isFirst ? ChevronsUp : ChevronUp;
                        const href = getLinkByIndex(isFirst ? 0 : index - 1);
                        const content = (
                            <>
                                <Icon className="-rotate-90 h-3 w-3" /> {isFirst ? "" : "Prev"}
                            </>
                        );

                        const classes = "flex items-center justify-center gap-1 p-2 rounded-lg text-forground bg-background-code border border-border";

                        return isDisabled ? (
                            <div key={type} className={`opacity-50 select-none ${classes}`}>{content}</div>
                        ) : (
                            <Link key={type} href={href} className={`${classes} hover:bg-foreground/20 cursor-pointer`}>
                                {content}
                            </Link>
                        );
                    })}
                </div>

                {/* Page Numbers */}
                <div className="flex flex-nowrap items-center gap-2 justify-center -mx-1">
                    {pageNumber > 3 && <span className="text-sm select-none">...</span>}
                    {pageButtons}
                    {pageNumber < totalPages - 2 && <span className="text-sm select-none">...</span>}
                </div>

                {/* Next Group */}
                <div className="flex flex-col max-lg:flex-row max-lg:items-center max-xs:flex-col max-xs:items-start items-start gap-2 flex-wrap justify-end">
                    {["last", "next"].map((type) => {
                        const isLast = type === "last";
                        const isDisabled = index >= totalPages - 1;
                        const href = getLinkByIndex(isLast ? totalPages - 1 : index + 1);
                        const Icon = isLast ? ChevronsUp : ChevronUp;
                        const content = (
                            <>
                                {isLast ? <Icon className="rotate-90 h-3 w-3" /> : <>Next <Icon className="rotate-90 h-3 w-3" /></>}
                            </>
                        );

                        const classes = "flex items-center justify-center gap-1 p-2 rounded-lg text-forground bg-background-code border border-border";

                        return isDisabled ? (
                            <div key={type} className={`opacity-50 select-none ${classes}`}>{content}</div>
                        ) : (
                            <Link key={type} href={href} className={`${classes} hover:bg-foreground/20 cursor-pointer`}>
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>

    )
}
