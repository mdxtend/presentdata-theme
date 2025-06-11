import Link from 'next/link'
import React from 'react'

export interface ButtonProps {
  href?: string
  title: string
  downloadable?: boolean
  external?: boolean
  onClick?: () => void
  asButton?: boolean // forces <button> instead of <a>
  className?: string
}

const Button = ({
  href = '#',
  title,
  downloadable,
  external,
  onClick,
  asButton = false,
  className = ''
}: ButtonProps) => {
  const baseClass = 'w-fit p-1.5 px-6 max-lg:p-1 max-lg:px-3 bg-primary-bright hover:bg-primary text-black font-mono border border-primary uppercase text-sm max-lg:text-xs rounded-[8px] font-bold no-underline'
  const mergedClass = `${baseClass} ${className}`

  if (asButton || (!href && onClick)) {
    return (
      <button onClick={onClick} className={mergedClass}>
        {title}
      </button>
    )
  }

  if (external) {
    return (
      <Link
        href={href}
        download={downloadable}
        target="_blank"
        rel="noopener noreferrer"
        className={mergedClass}
      >
        {title}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      download={downloadable ? '' : undefined}
      className={mergedClass}
    >
      {title}
    </Link>
  )
}

export default Button
