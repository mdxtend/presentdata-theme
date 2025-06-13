import React from 'react';
import Link from 'next/link';

const Copyright = ({className}: {className?: string}) => {
    return (
        <div>
            <Link href="https://github.com/mdxtend/presentdata" target='_blank' className={`${className} flex items-center gap-1.5 font-mono text-xs max-lg:text-[10px] leading-3 text-muted-foreground`}>
                <span>Powered by</span>
                <span className="px-3 py-1.5 rounded-full border border-border-muted bg-background-dark">PresentDATA</span>
            </Link>
        </div>
    )
}

export default Copyright