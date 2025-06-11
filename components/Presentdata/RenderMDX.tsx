import React from 'react'
import { Profile } from '@/.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { mdxComponents } from '@/components/Presentdata/MDXComponents';

interface RenderMDXProps<T = { body?: { code?: string } }> {
  content?: T | Profile | null
  className?: string
}

const RenderMDX = <T extends { body?: { code?: string } }>({ content, className = '' }: RenderMDXProps<T>) => {
  if (!content?.body?.code) {
    return <div className="text-center py-10 text-gray-500">Content not available</div>
  }

  const MDXContent = useMDXComponent(content.body.code)

  return (
    <div
      className={`${className} max-w-full w-full text-lg font-sans font-[350] max-lg:font-[400] text-foreground prose prose-sm max-sm:prose-base max-md:prose-lg !leading-normal prose-pre:m-0 prose-blockquote:p-px prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg dark:prose-invert prose-li:marker:text-base prose-li:marker:font-bold prose-li:list-disc prose-li:marker:relative prose-li:marker:text-primary-light prose-li:marker:-left-10 prose-blockquote:border-primary-light prose-hr:border-border prose-hr:rounded-full  docs-slug `}
    >
      <MDXContent components={mdxComponents} />
    </div>
  )
}

export default RenderMDX
