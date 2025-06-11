import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export interface PDFViewerProps {
  src: string
  title?: string
  className?: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ src, title = 'PDF Document', className = '' }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [validatedSrc, setValidatedSrc] = useState<string | null>(null)

  const closeOpen = () => setIsOpen(false)

  // resolve full src path
  useEffect(() => {
    let finalSrc = src
    if (!(src.startsWith('http') || src.startsWith('data:'))) {
      let basePath = router.asPath.split('#')[0]
      let base = '/data' + basePath
      if (!base.endsWith('/')) base += '/'
      const cleanSrc = src.startsWith('/') ? src.slice(1) : src
      finalSrc = base + cleanSrc
    }

    // validate the PDF path
    fetch(finalSrc, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) throw new Error('Invalid PDF')
        setValidatedSrc(finalSrc)
        setHasError(false)
      })
      .catch(() => {
        setHasError(true)
        setValidatedSrc(null)
      })
  }, [src, router.asPath])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOpen()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <div className={`h-12 w-fit max-lg:h-10 my-4 flex items-center justify-center text-foreground-accent hover:text-foreground font-mono uppercase text-sm max-lg:text-xs bg-background-secondary border border-border hover:bg-background-tertiary hover:border-border-tertiary rounded-xl cursor-pointer group overflow-hidden ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="py-3 p-1 pl-4 cursor-pointer rounded-xl"
          aria-label={`Open ${title} preview`}
        >
          {title}
        </button>
        <Link
          href={validatedSrc || '#'}
          target="_blank"
          className="py-3 p-1 pr-4 text-foreground-accent no-underline hover:underline hover:underline-offset-4 hover:text-foreground"
        >
          [Preview]
        </Link>
      </div>

      {isOpen && (
        <motion.div
          className="fixed inset-0 flex flex-col z-[1000]"
          initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0, 0, 0, 0)' }}
          animate={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          exit={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0, 0, 0, 0)' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ WebkitBackdropFilter: 'blur(0px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-between items-center p-4 h-12">
            <span>{title}</span>
            <button
              className="py-2.5 px-4 max-lg:h-10 max-lg:px-4 text-foreground-accent hover:text-foreground font-mono uppercase text-sm max-lg:text-xs bg-background-secondary border border-border hover:bg-background-tertiary hover:border-border-tertiary rounded-lg cursor-pointer group"
              onClick={closeOpen}
              type="button"
              aria-label="Close preview"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 56.326 56.326"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current fill-current text-foreground-accent group-hover:text-foreground"
                strokeWidth={4}
              >
                <path d="M477.613,422.087l25.6-25.6a1.5,1.5,0,0,0-2.122-2.121l-25.6,25.6-25.6-25.6a1.5,1.5,0,1,0-2.121,2.121l25.6,25.6-25.6,25.6a1.5,1.5,0,0,0,2.121,2.122l25.6-25.6,25.6,25.6a1.5,1.5,0,0,0,2.122-2.122Z" transform="translate(-447.328 -393.924)" />
              </svg>
            </button>
          </div>

          {hasError ? (
            <div className="flex items-center justify-center w-full h-full p-10 whitespace-nowrap border border-border rounded bg-background-secondary text-sm font-mono uppercase text-red-500">
              Failed to load content
            </div>
          ) : (
            <iframe
              src={validatedSrc || ''}
              title={title}
              className="flex-1 w-full"
              style={{ border: 'none' }}
              loading="lazy"
            />
          )}
        </motion.div>
      )}
    </>
  )
}

export default PDFViewer
