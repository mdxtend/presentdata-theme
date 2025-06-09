import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import presentData from '@/public/data/presentdata.config'
import Head from 'next/head'
import * as Contentlayer from 'contentlayer/generated'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// You need to import or define these components/utilities used in DocsPage

import { format, parseISO } from 'date-fns';
import RenderMDX from '@/components/Presentdata/RenderMDX';
import Feedback from '@/components/Elements/Feedback';
import Breadcrumb from '@/components/Elements/Breadcrumb';
// import { allPublications, type Publication } from 'contentlayer/generated';
import { AddBookMark, CommentBox, IosShareSVG, LinkNewWindow, OptionsSVG, ReadTimeSVG } from '@/components/Presentdata/Icons';
import TableOfContents from '@/components/Elements/TableOfContents'
// Assuming allPublications is imported or accessible here for the Explore section


const addOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

const FormattedDate = (publishedAt: string) => {
  const date = parseISO(publishedAt);
  const day: number = parseInt(format(date, 'd'), 10);
  const dayWithSuffix = addOrdinalSuffix(day);
  const formatted = format(date, `EEEE, LLLL '${dayWithSuffix}', yyyy`);
  return formatted;
};

const formatAuthorName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '_');
}

const formatLinkAuthorName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '');
}



export default function Page({ page, doc, siteMetaData }: { page: any, doc: any, siteMetaData: any }) {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  if (router.isFallback) return <div>Loading...</div>
  if (!page && !doc) return <div>Not Found</div>

  if (doc) {
    // Render the DocsPage UI when doc is available
    useEffect(() => {
      const { hash } = window.location
      if (!hash) return
      const id = hash.substring(1)
      const target = document.getElementById(id)
      if (!target) return
      const root = document.documentElement
      root.style.scrollBehavior = 'auto'
      target.scrollIntoView()
      requestAnimationFrame(() => {
        root.style.scrollBehavior = ''
      })
    }, [])

    return (
      <article>
        <Head>
          <title>{`${doc?.title} | ${siteMetaData.title}`}</title>
          <meta name="description" content={doc?.description || siteMetaData.description || ''} />
          <meta property="og:title" content={`${doc?.title} | ${siteMetaData.title}`} />
          <meta property="og:description" content={doc?.description || siteMetaData.description || ''} />
          <meta property="og:type" content="article" />
        </Head>

        <div className="flex justify-between">
          <div className="flex justify-center max-w-[70%] max-lg:max-w-full mt-10 max-lg:mt-5">
            <div className="px-20 max-lg:px-4 w-full">
              <Breadcrumb />

              <div className="max-lg:text-xs font-medium z-10 ">
                <h1 className="uppercase font-serif font-extrabold text-3xl max-lg:text-2xl max-md:text-xl !tracking-widest !leading-normal relative w-full my-4 mb-0">
                  {doc?.title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-4 max-lg:gap-0 my-0 text-foreground-accent whitespace-nowrap">
                  <div className="flex gap-4 my-3 text-foreground-accent whitespace-nowrap">
                    <div className="flex gap-1 items-center">
                      <ReadTimeSVG className="w-5 fill-foreground-accent dark:fill-dark-text" />
                      {doc?.readingTime?.text || 'Unknown reading time'}
                    </div>
                    <div className="flex gap-1 items-center">
                      <time className="text-foreground-accent">
                        {doc?.publishedAt ? FormattedDate(doc.publishedAt) : "Date unavailable"}
                      </time>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <IosShareSVG className="w-5 -mt-[1.5px] cursor-pointer fill-foreground-accent dark:fill-dark-text hover:fill-dark" />
                    <OptionsSVG className="w-5 cursor-pointer fill-foreground-accent dark:fill-dark-text hover:fill-dark" />
                  </div>
                </div>
              </div>

              <RenderMDX content={doc} className="mt-10 mb-20" />
            </div>
          </div>

          <div className="max-lg:hidden block sticky top-[8rem] min-w-80 w-full max-w-[20%] max-lg:max-w-full max-h-[calc(100vh-12rem)]">
            <div className="">
              <TableOfContents item={doc} />
            </div>

          </div>
        </div>
      </article>
    )
  }

  // Original page UI fallback
  return (
    <div className="p-8 space-y-6">
      <Head>
        <title>{`${page?.title} | ${siteMetaData.title}`}</title>
        <meta name="description" content={page?.description || siteMetaData.description || ''} />
        <meta property="og:title" content={`${page?.title} | ${siteMetaData.title}`} />
        <meta property="og:description" content={page?.description || siteMetaData.description || ''} />
        <meta property="og:type" content="website" />
      </Head>

      <h1 className="text-3xl font-bold">{page?.title || doc?.title}</h1>
      <div>{doc?.code?.body}</div>

      {page?.downloadable && (
        <a href={page?.downloadLink} className="text-blue-500 underline" download>
          Download CV
        </a>
      )}

      {page?.sections.map((section: any, index: number) => (
        <div key={index}>
          <h2 className="text-xl font-semibold">{section.sectionTitle}</h2>

          {section.sectionType === 'list' && (
            <ul className="list-disc ml-5">
              {section.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.code && <strong>{item.code}:</strong>} {item.title} ({item.year}) – {item.mode}
                </li>
              ))}
            </ul>
          )}

          {section.sectionType === 'cards' && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {section.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm">
                    {item.level} – {item.status}
                  </div>
                  <div className="text-sm">{item.project}</div>
                </div>
              ))}
            </div>
          )}

          {section.sectionType === 'media' && (
            <div className="space-y-4 mt-2">
              {section.items.map((item: any, idx: number) => (
                <div key={idx} className="border p-4">
                  <div className="text-lg font-semibold">{item.title}</div>
                  <div className="text-sm mb-2">{item.event}</div>
                  <iframe src={item.videoUrl} className="w-full aspect-video" allowFullScreen />
                  {item.slidesLink && (
                    <a href={item.slidesLink} className="text-blue-500 underline" target="_blank" rel="noreferrer">
                      View Slides
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  // Collect paths from presentData.pages
  const generatePagePaths = (page: any, base: string[] = []) => {
    const path = [...base, page.slug]
    let paths = [{ params: { slug: path } }]
    if (page.children) {
      for (const child of page.children) {
        paths = paths.concat(generatePagePaths(child, path))
      }
    }
    return paths
  }

  const pagePaths = presentData.pages.flatMap((page: any) => generatePagePaths(page))

  // Collect paths from all Contentlayer docs
  const docPaths = Object.entries(Contentlayer)
    .filter(([key, value]) => key.startsWith('all') && Array.isArray(value))
    .flatMap(([_, docs]) =>
      (docs as any[]).map((doc) => ({
        params: { slug: doc._raw.flattenedPath.split('/') },
      }))
    )

  return {
    paths: [...pagePaths, ...docPaths],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugParts = params?.slug as string[]
  const flattened = slugParts.join('/')

  // Try to find a page from presentData.pages
  const findPage = (pages: any[], parts: string[]): any => {
    for (const page of pages) {
      if (page.slug === parts[0]) {
        if (parts.length === 1) return page
        if (page.children) return findPage(page.children, parts.slice(1))
      }
    }
    return null
  }

  const page = findPage(presentData.pages, slugParts)

  // Try to find a doc from Contentlayer
  const getAllDocs = () =>
    Object.entries(Contentlayer)
      .filter(([key, value]) => key.startsWith('all') && Array.isArray(value))
      .flatMap(([_, docs]) => docs as any[])

  // If a page exists and defines a custom path base
  const docPath = page?.pageType?.path
    ? `${page.pageType.path}/${flattened}`
    : flattened

  const doc = getAllDocs().find((d) => d._raw.flattenedPath === docPath || d._raw.flattenedPath === flattened) || null

  // Return whichever matched
  //   if (!page && !doc) return { notFound: true }

  return {
    props: {
      page: page || null,
      doc,
      siteMetaData: presentData.siteMetaData,
    },
  }
}
