import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineDocumentType, makeSource, type ComputedFields, type FieldDefs } from '@contentlayer/source-files'
import presentData from './public/data/presentdata.config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRewrite from 'rehype-rewrite'
import rehypeStringify from 'rehype-stringify'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import { h } from 'hastscript'
import rehypeAddClasses from 'rehype-add-classes'
import type { Page, PageType } from '@/lib/types/presentdata'

const createToc = async (body: string) => {
  const slugger = new GithubSlugger();
  slugger.reset();

  const lines = body.split('\n');
  let insideCodeBlock = false;
  const headings = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) continue;

    const match = line.match(/^(#{1,4})\s+(.*)/);
    if (match) {
      const level = match[1].length === 1 ? 'one'
                  : match[1].length === 2 ? 'two'
                  : 'three';
      const text = match[2];
      headings.push({
        level,
        text,
        slug: slugger.slug(text),
      });
    }
  }

  return headings;
};

const computedFields: ComputedFields = {
  url: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(doc.body.raw),
  },
  toc: {
    type: 'json',
    resolve: async (doc) => await createToc(doc.body.raw),
  },
}

const Profile = defineDocumentType(() => ({
  name: "Profile",
  filePathPattern: `profile/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: false },
    preview: { type: "string", required: false },
    publishedAt: { type: 'date', required: false },
    updatedAt: { type: 'date', required: false },
    description: { type: 'string', required: false },
    image: { type: 'string', required: false },
    isPublished: { type: 'boolean', default: false },
    author: { type: 'string', required: false },
    username: { type: 'string', required: false },
    github: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields,
}))

const PresentDataDocumentTypes = presentData.pages
  .filter((page): page is typeof page & { pageType: PageType } => Boolean(page.pageType))
  .map(page =>
    defineDocumentType(() => ({
      name: page.pageType.name,
      filePathPattern: `${page.pageType.path}/**/*.mdx`,
      contentType: 'mdx',
      fields: page.pageType.fields,
      computedFields,
    }))
  )

const codeOptions = {
  grid: false,
  theme: 'monokai',
  keepBackground: false,
  filterMetaString: (str: string) =>
    str
      .replace(/lines=\[([^]*)\]/g, '{$1}')
      .replace(/filename=([^ ]*)/g, 'title="$1"'),
  tokensMap: {
    fn: 'entity.name.function',
  },
}

export default makeSource({
  contentDirPath: './public/data',
  disableImportAliasWarning: true,
  documentTypes: [Profile, ...PresentDataDocumentTypes],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAddClasses, { h1: 'group-heading', h2: 'group-heading', h3: 'group-heading', h4: 'group-heading', h5: 'group-heading', h6: 'group-heading' }],
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { className: ['anchor'] },
        content: () =>
          h(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 16,
              height: 16,
              fill: 'currentColor',
              stroke: 'currentColor',
              strokeWidth: '0',
              viewBox: '0 0 24 24',
              className: 'anchor-icon'
            },
            [
              h('path', { fill: 'none', d: 'M0 0h24v24H0z' }),
              h('path', {
                d: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'
              })
            ]
          )
      }],
      [rehypePrettyCode as any, codeOptions],
    ],
  },
})
