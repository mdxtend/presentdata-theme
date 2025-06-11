import Link from 'next/link'

export default function Pagination({
    currentId,
    typeName,
    documents
}: {
    currentId: string
    typeName: string
    documents: any[]
}) {
    const prefix = `${typeName?.toLowerCase?.() || ''}s/`

    const siblings = documents
        .filter(d =>
            d._id.startsWith(prefix) &&
            d._id !== `${prefix}index.mdx` &&
            d._id.split('/').length === 3 // ensures it's in some-slug/filename.mdx
        )
        .sort((a, b) => a._id.localeCompare(b._id))

    const index = siblings.findIndex(d => d._id === currentId)
    const prev = index > 0 ? siblings[index - 1] : null
    const next = index < siblings.length - 1 ? siblings[index + 1] : null

    return (
        <div className="flex justify-between border-t mt-8 pt-6">
            {prev ? (
                <Link href={`/${prev._raw.flattenedPath}`}>
                    <span className="text-sm text-blue-600 hover:underline">← {prev.title}</span>
                </Link>
            ) : <div />}
            {next ? (
                <Link href={`/${next._raw.flattenedPath}`}>
                    <span className="text-sm text-blue-600 hover:underline">{next.title} →</span>
                </Link>
            ) : <div />}
        </div>
    )
}
