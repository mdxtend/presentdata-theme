import ListItems, { ListItem } from '@/components/Elements/ListIems'
import { Close } from '@/components/Presentdata/Icons'
import { allDocuments } from 'contentlayer/generated'
import type { DocumentTypes } from 'contentlayer/generated'
import { Search } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

type TaggedDoc = DocumentTypes & { tags?: string[]; _type: string }

const hasTags = (doc: DocumentTypes): doc is TaggedDoc =>
    Array.isArray((doc as any).tags)

const levenshtein = (a: string, b: string): number => {
    const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    )
    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp[a.length][b.length]
}

const isFuzzyMatch = (tag: string, keyword: string): boolean => {
    tag = tag.toLowerCase()
    keyword = keyword.toLowerCase()
    if (tag.includes(keyword)) return true
    return levenshtein(tag, keyword) <= 2 && keyword.length >= 3
}

const TopicPage = () => {
    const router = useRouter()
    const initialQuery = typeof router.query.s === 'string' ? router.query.s : 'all'
    const [search, setSearch] = useState(initialQuery)

    useEffect(() => {
        const timeout = setTimeout(() => {
            const s = search || 'all'
            if (router.query.s !== s) {
                router.push({ pathname: '/topic', query: { s } }, undefined, { shallow: true })
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            const param = new URLSearchParams(url.split('?')[1] || '').get('s') || 'all'
            setSearch(param)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => router.events.off('routeChangeComplete', handleRouteChange)
    }, [router.events])

    const topic = decodeURIComponent(search).toLowerCase()

    const matchedDocs = useMemo(() => {
        const seen = new Set<string>()
        const docs = allDocuments
            .filter(hasTags)
            .filter(doc =>
                topic === 'all' || doc.tags?.some(tag => isFuzzyMatch(tag, topic))
            )
            .filter(doc => {
                if (seen.has(doc.url)) return false
                seen.add(doc.url)
                return true
            })
            .map(doc => ({ ...doc, _type: (doc as any)._type }))
        return docs
    }, [topic])

    const grouped = useMemo(() => {
        return matchedDocs.reduce<Record<string, TaggedDoc[]>>((acc, doc) => {
            const type = doc.type ?? 'Unknown'
            if (!acc[type]) acc[type] = []
            acc[type].push(doc)
            return acc
        }, {})
    }, [matchedDocs])

    return (
        <div className="space-y-8 mx-auto py-10 max-lg:py-4 px-4">
            <form
                onSubmit={e => e.preventDefault()}
                className="relative flex max-w-3xl mx-auto group w-full border-3 border-border-muted focus-within:border-border rounded-full transition duration-200 ease-out"
            >
                <div className="absolute top-1/2 -translate-y-1/2 left-0 p-3 cursor-pointer">
                    <Search className="w-6 h-6 mb-0.5 text-foreground-muted" />
                </div>
                <input
                    type="text"
                    value={search}
                    id="main-search"
                    placeholder="Search by topic tag..."
                    onChange={e => setSearch(e.target.value)}
                    className="px-4 pb-3 pl-11 w-full bg-transparent text-foreground placeholder-foreground-muted focus:ring-0 outline-none border-0 focus:outline-none text-2xl max-lg:text-xl transition-all duration-200 ease-in-out caret-primary"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 p-3 cursor-pointer" onClick={() => setSearch("")}>
                    <Close className="w-6 h-6 mb-0.5 text-foreground-muted" />
                </div>
            </form>

            {Object.keys(grouped).length === 0 ? (
                <p className="text-center font-mono text-foreground-accent">
                    No results found for: <strong>{search}</strong>
                </p>
            ) : (
                Object.entries(grouped).map(([type, docs]) => (
                    <div key={type}>
                        <h2 className="text-5xl max-lg:text-2xl font-serif mb-6">
                            {type} - {docs.length}
                        </h2>
                        <ListItems items={docs
                            .sort(
                                (a, b) =>
                                    new Date(b.publishedAt || '').getTime() -
                                    new Date(a.publishedAt || '').getTime()
                            )} />
                    </div>
                ))
            )}
        </div>
    )
}

export default TopicPage
