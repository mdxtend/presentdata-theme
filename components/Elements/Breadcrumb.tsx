import Link from 'next/link'
import { useRouter } from 'next/router'

const Breadcrumb = () => {
    const router = useRouter()
    const path = router.asPath.split('?')[0]
    const segments = path
        .split('/')
        .filter(Boolean)
        .filter(seg => !seg.includes('#'))

    const items = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        return {
            label: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
            href,
        }
    })

    if (items.length > 0) {
        items[items.length - 1].label = decodeURIComponent(router.query?.title as string || items.at(-1)?.label || '')
    }

    return (
        <nav aria-label="Breadcrumb" className="my-4 line-clamp-1 whitespace-nowrap min-h-6">
            <ol className="flex flex-wrap items-center text-foreground-accent font-medium">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        {index < items.length - 1 ? (
                            <>
                                <Link href={item.href} className="hover:text-foreground">
                                    <div className="transition-colors duration-200">{item.label}</div>
                                </Link>
                                <span className="mx-1 mt-px">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 512 512"
                                        height="18px"
                                        width="18px"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
                                    </svg>
                                </span>
                            </>
                        ) : (
                            <span className="text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb
