import React from 'react'
import { Quote } from '../../Icons';
import { useRouter } from 'next/router';
import Image, { StaticImageData } from 'next/image'

export interface QuoteCardProps {
    name: string;
    title?: string
    avatar?: string | StaticImageData
    children: React.ReactNode
}

const QuoteCard = ({ name, title, avatar, children }: QuoteCardProps) => {
    const router = useRouter();

    if (!avatar) return null;
    let filename: string = '';

    let resolvedSrc: string | StaticImageData = avatar;
    if (typeof avatar === 'string') {
        filename = avatar.split('/').pop() || '';
        if (avatar.startsWith('http') || avatar.startsWith('data:')) {
            resolvedSrc = avatar;
        } else {
            let basePath = router.asPath.split('#')[0];
            let base = '/data' + basePath;
            if (!base.endsWith('/')) base += '/';
            const cleanSrc = avatar.startsWith('/') ? avatar.slice(1) : avatar;
            resolvedSrc = base + cleanSrc;
        }
    } else {
        if (avatar && typeof avatar.src === 'string') {
            filename = avatar.src.split('/').pop() || '';
        } else {
            filename = 'unknown_image';
        }
    }
    return (
        <figure className="relative rounded-xl border-4 border-border-muted bg-background p-6 shadow-sm max-w-xl z-10">
            <div className='absolute -top-6 -left-6 bg-background p-4 -z-10'>
                <Quote className='rotate-180 text-foreground-muted w-6 h-6' />
            </div>
            <div className='absolute -bottom-6 -right-6 bg-background p-4 -z-10'>
                <Quote className='text-foreground-muted w-6 h-6' />
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
                        className="h-10 w-10 rounded-full object-cover border"
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
