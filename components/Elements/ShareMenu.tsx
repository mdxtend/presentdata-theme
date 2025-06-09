'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { StaticImageData } from 'next/image';

const ShareMenu = ({src}:{src?: string | StaticImageData;}) => {
  const [copied, setCopied] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : '' + src
  const embedCode = `<iframe src="${url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socials = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="px-5 py-3 border border-border bg-background-secondary rounded-xl w-full max-w-lg space-y-4">
      <h3 className="text-sm text-center !mt-0 mb-4">Share</h3>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 border px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 text-sm"
        />
        <button
          onClick={() => copyToClipboard(url)}
          className="bg-gray-200 dark:bg-neutral-700 px-2 py-1 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-neutral-600"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex space-x-3">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md"
          >
            {s.name}
          </a>
        ))}
      </div>

      <div>
        <button
          onClick={() => setShowEmbed(!showEmbed)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showEmbed ? 'Hide Embed Code' : 'Share as Embed'}
        </button>
        {showEmbed && (
          <div className="mt-2 space-y-2">
            <textarea
              readOnly
              value={embedCode}
              className="w-full text-xs bg-gray-100 dark:bg-neutral-800 border p-2 rounded-md font-mono"
              rows={3}
            />
            <button
              onClick={() => copyToClipboard(embedCode)}
              className="bg-gray-200 dark:bg-neutral-700 px-2 py-1 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-neutral-600"
            >
              {copied ? 'Copied' : 'Copy Embed'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShareMenu
