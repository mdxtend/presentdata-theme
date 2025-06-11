import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import * as Contentlayer from 'contentlayer/generated';

import ListItems from '@/components/Elements/ListIems';
import Breadcrumb from '@/components/Elements/Breadcrumb';
import LinkButton from '@/components/Elements/LinkButton';
import RenderMDX from '@/components/Presentdata/RenderMDX';
import presentData from '@/public/data/presentdata.config';
import TableOfContents from '@/components/Elements/TableOfContents';
import { IosShareSVG, OptionsSVG, ReadTimeSVG, UpArrow } from '@/components/Presentdata/Icons';
import Pagination from '@/components/Elements/Pagination';

const addOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

const FormattedDate = (publishedAt: string): string => {
  const date = parseISO(publishedAt);
  const day: number = parseInt(format(date, 'd'), 10);
  const dayWithSuffix = addOrdinalSuffix(day);
  return format(date, `EEEE, LLLL '${dayWithSuffix}', yyyy`);
};

interface PageProps {
  page: any;
  doc: any;
  siteMetaData: any;
}

export default function Page({ page, doc, siteMetaData }: PageProps) {
  const router = useRouter();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // let isDocPage;
  // if (!page) isDocPage = true;

  // console.log(page);
  // console.log(doc);


  const typeName = page?.pageType?.name;
  const key = `all${typeName}s` as keyof typeof Contentlayer;
  const documents = Contentlayer[key] as unknown as any[] || [];
  const docPage = documents.find(d => d._id === `${typeName.toLowerCase()}s/index.mdx`);
  const isDocPage = docPage?.url?.replace(/\/+$/, '') === router.asPath.replace(/\/+$/, '');

  console.log(page);
  console.log(typeName);


  useEffect(() => {
    if (!doc) return;

    const { hash } = window.location;
    if (!hash) return;

    const id = hash.substring(1);
    const target = document.getElementById(id);
    if (!target) return;

    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView();
    requestAnimationFrame(() => {
      root.style.scrollBehavior = '';
    });
  }, [doc]);

  useEffect(() => {
    if (!doc) return;

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doc]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  console.log(documents);


  if (router.isFallback) return <div>Loading...</div>;
  if (!page && !doc) return <div>Not Found</div>;
  // if (!page && !docPage) return <div>Create {typeName}/index.mdx</div>;

  if (page || isDocPage) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-2 p-4 py-10 max-lg:py-5">
        <Head>
          <title>{`${page?.title ?? docPage?.title ?? 'Untitled'} | ${siteMetaData?.title ?? 'Site'}`}</title>
          <meta name="description" content={page?.description ?? docPage?.description ?? siteMetaData?.description ?? ''} />
          <meta property="og:title" content={`${page?.title ?? docPage?.title ?? 'Untitled'} | ${siteMetaData?.title ?? 'Site'}`} />
          <meta property="og:description" content={page?.description ?? docPage?.description ?? siteMetaData?.description ?? ''} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://yoursite.com/${page?.slug ?? docPage?.url ?? ''}`} />
          <link rel="canonical" href={`https://yoursite.com/${page?.slug ?? docPage?.url ?? ''}`} />
        </Head>

        <h1 className="text-5xl max-lg:text-2xl font-serif mb-3">{page?.title || "Untitled"}</h1>

        {docPage && (
          <section>
            <RenderMDX content={docPage} className="mt-10 mb-20" />
          </section>
        )}

        {page?.sectionButton && (
          <LinkButton title={page.sectionButton.title} href={page.sectionButton.link} downloadable />
        )}

        {page.pageType && (
          <ListItems items={documents} />
        )}
      </div>
    );
  }

  if (doc) {
    return (
      <article>
        <Head>
          <title>{`${doc?.title} | ${siteMetaData.title}`}</title>
          <meta name="description" content={doc?.description || siteMetaData.description || ''} />
          <meta property="og:title" content={`${doc?.title} | ${siteMetaData.title}`} />
          <meta property="og:description" content={doc?.description || siteMetaData.description || ''} />
          <meta property="og:type" content="article" />
        </Head>

        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className='fixed z-50 max-w-7xl mx-auto bottom-5 right-5 p-3 border border-border text-foreground-accent rounded-full bg-background-secondary cursor-pointer'
            aria-label="Scroll to top"
          >
            <UpArrow className='w-5 h-5' />
          </button>
        )}

        <div className="flex justify-between">
          <div className="flex justify-center max-w-[70%] max-lg:max-w-full mt-10 max-lg:mt-5">
            <div className="px-20 max-lg:px-4 w-full">
              {/* FOR MAINTAINING MAX-WIDTH */}
              <div className='min-w-7xl w-full h-0 bg-transparent' />
              
              <Breadcrumb />

              <div className="max-lg:text-xs font-medium z-10">
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

          <div className="max-lg:hidden block sticky mt-16 top-[8rem] min-w-80 w-full max-w-[20%] max-lg:max-w-full max-h-[calc(100vh-12rem)]">
            <div>
              <TableOfContents item={doc} />
              <Pagination currentId={doc._id} typeName={typeName} documents={documents} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return <div>Create {typeName}/index.mdx</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const generatePagePaths = (page: any, base: string[] = []): { params: { slug: string[] } }[] => {
    const path = [...base, page.slug];
    let paths = [{ params: { slug: path } }];
    if (page.children) {
      for (const child of page.children) {
        paths = paths.concat(generatePagePaths(child, path));
      }
    }
    return paths;
  };

  const pagePaths = presentData.pages.flatMap((page: any) => generatePagePaths(page));

  const docPaths = Object.entries(Contentlayer)
    .filter(([key, value]) => key.startsWith('all') && Array.isArray(value))
    .flatMap(([_, docs]) =>
      (docs as any[]).map((doc) => ({
        params: { slug: doc._raw.flattenedPath.split('/') },
      }))
    );

  return {
    paths: [...pagePaths, ...docPaths],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugParts = params?.slug as string[];
  const flattened = slugParts.join('/');

  const findPage = (pages: any[], parts: string[]): any => {
    for (const page of pages) {
      if (page.slug === parts[0]) {
        if (parts.length === 1) return page;
        if (page.children) return findPage(page.children, parts.slice(1));
      }
    }
    return null;
  };

  const page = findPage(presentData.pages, slugParts);

  const getAllDocs = (): any[] =>
    Object.entries(Contentlayer)
      .filter(([key, value]) => key.startsWith('all') && Array.isArray(value))
      .flatMap(([_, docs]) => docs as any[]);

  const docPath = page?.pageType?.path
    ? `${page.pageType.path}/${flattened}`
    : flattened;

  const doc = getAllDocs().find((d) => d._raw.flattenedPath === docPath || d._raw.flattenedPath === flattened) || null;

  if (!page && !doc) return { notFound: true };

  return {
    props: {
      page: page || null,
      doc,
      siteMetaData: presentData.siteMetaData,
    },
  };
};