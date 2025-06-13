import Link from 'next/link';
import React from 'react';

interface LinkButtonProps {
  href: string;
  title: string;
  downloadable?: boolean;
}

const LinkButton = ({ title, href="#", downloadable }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      {...(downloadable ? { download: true } : {})}
      className='w-fit p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-foreground font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px] font-bold'
    >
      {title}
    </Link>
  )
}

export default LinkButton