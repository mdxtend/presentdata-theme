import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import presentData from '@/public/data/presentdata.config'
import Head from 'next/head'
import ListItems from '@/components/Elements/ListIems'
import * as Contentlayer from 'contentlayer/generated'
import Link from 'next/link'
import LinkButton from '@/components/Elements/LinkButton'

export default function Page({ page, siteMetaData }: { page: any, siteMetaData: any }) {
    const router = useRouter()

    if (router.isFallback) return <div>Loading...</div>
    const typeName = page.pageType?.name
    const key = `all${typeName}s` as keyof typeof Contentlayer
    const docItems = Contentlayer[key] as unknown as any[] || []
    if (!page) return <div>Not Found</div>



    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-2 p-4 py-10 max-lg:py-5">
            <Head>
                <title>{`${page.title} | ${siteMetaData.title}`}</title>
                <meta name="description" content={page.description || siteMetaData.description || ''} />
                <meta property="og:title" content={`${page.title} | ${siteMetaData.title}`} />
                <meta property="og:description" content={page.description || siteMetaData.description || ''} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://yoursite.com/${page.slug}`} />
                <link rel="canonical" href={`https://yoursite.com/${page.slug}`} />
            </Head>

            <h1 className="text-5xl max-lg:text-2xl font-serif mb-3">{page.title}</h1>

            {page.sectionButton && (
                <LinkButton title={page.sectionButton.title} href={page.sectionButton.link} downloadable />
            )}

            {page.pageType && (
                <ListItems items={docItems} />
            )}

            {page.sections?.map((section: any, index: number) => (
                <div className='mt-5' key={index}>
                    <h2 className="text-3xl max-lg:text-xl font-serif mb-3">{section.sectionTitle}</h2>

                    {section?.sectionType === 'list' && (
                        <ul className='flex flex-col gap-3 text-lg'>
                            {section.items.map((item: any, idx: number) => (
                                <li key={idx} className='ml-4 list-disc list-item'>
                                    <Link href={item.url || "#"} className="font-medium text-blue-600 hover:underline ">
                                        {item.mainTitle}
                                    </Link>
                                    {(item.secondaryTitle || item.tertiaryTitle) && (
                                        <span className="text-foreground-accent ml-2">
                                            {item.secondaryTitle && <>{item.secondaryTitle}</>}
                                            {item.secondaryTitle && item.tertiaryTitle && <> – </>}
                                            {item.tertiaryTitle && <>{item.tertiaryTitle}</>}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {section.sectionType === 'cards' && (
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3 mt-2 w-full">
                            {section.items.map((item: any, idx: number) => (
                                <div key={idx} className="border border-border rounded-2xl bg-background-secondary p-5 max-w-2xl w-full min-h-80">
                                    <div className="text-xl font-medium font-serif tracking-wider">{item.name}</div>
                                    <div className="text-sm">{item.level} – {item.status}</div>
                                    <div className="text-sm">{item.project}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {section.sectionType === 'media' && (
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3 mt-2 w-full">
                            {section.items.map((item: any, idx: number) => (
                                <div key={idx} className="border border-border rounded-xl bg-background-secondary p-5 max-w-2xl">
                                    <div className="text-xl font-medium font-serif tracking-wider">{item.title}</div>
                                    <div className="text-sm font-mono mt-1">{item.event}</div>
                                    <iframe src={item.videoUrl} className="w-full aspect-video rounded-xl my-4" allowFullScreen />
                                    {item.slidesLink && (
                                        <button className='w-fit p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-black font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px] font-bold cursor-pointer'>
                                            <Link href={item.slidesLink || "#"}>
                                                View Slides
                                            </Link>
                                        </button>
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
    const pages = presentData.pages || []
    return {
        paths: pages.map((p: any) => ({ params: { slug: p.slug } })),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string
    const pages = presentData.pages || []
    const siteMetaData = presentData.siteMetaData || []
    const page = pages.find((p: any) => p.slug === slug)

    if (!page) return { notFound: true }

    return {
        props: { page, siteMetaData },
    }
}
