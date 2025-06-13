import React, { useState } from 'react'
import { Quote } from '../../Icons'
import { useRouter } from 'next/router'
import Image, { StaticImageData } from 'next/image'

export interface QuoteCardProps {
    name: string
    title?: string
    avatar?: string | StaticImageData
    children: React.ReactNode
}

const QuoteCard = ({ name, title, avatar, children }: QuoteCardProps) => {
    const router = useRouter()
    const [fallback, setFallback] = useState(0)

    if (!avatar) return null

    let resolvedSrc: string | StaticImageData = avatar

    if (typeof avatar === 'string') {
        const [cleanPath] = avatar.split(/[?#]/)

        if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/data')) {
            resolvedSrc = avatar
        } else {
            const baseParts = router.asPath.split('#')[0].split('?')[0].split('/').filter(Boolean)
            const reducedParts = baseParts.slice(0, baseParts.length - fallback)
            let base = '/data/' + reducedParts.join('/')
            if (!base.endsWith('/')) base += '/'

            const relativePath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath
            resolvedSrc = base + relativePath
        }
    }

    const handleError = () => {
        setFallback(f => f + 1)
    }

    return (
        <figure className="relative rounded-xl border-4 border-border-muted bg-background p-6 shadow-sm max-w-xl z-10">
            <div className="absolute -top-6 -left-6 bg-background p-4 -z-10">
                <Quote className="rotate-180 text-foreground-muted w-6 h-6" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background p-4 -z-10">
                <Quote className="text-foreground-muted w-6 h-6" />
            </div>

            <blockquote className="text-lg italic leading-relaxed text-foreground !border-blue-500 z-20">
                {children}
            </blockquote>
            <figcaption className="flex h-14 items-center gap-2">
                {avatar && (
                    <Image
                        src={resolvedSrc}
                        alt={name}
                        width={20}
                        height={20}
                        className="h-10 w-10 rounded-full object-cover border border-border-muted"
                        onError={handleError}
                    />
                )}
                <div>
                    <div className="font-semibold text-foreground">{name}</div>
                    {title && <div className="text-sm text-foreground-accent tracking-wide">{title}</div>}
                </div>
            </figcaption>
        </figure>
    )
}

export default QuoteCard
