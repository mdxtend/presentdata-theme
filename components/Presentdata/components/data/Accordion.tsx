import React, { useState, useRef, useEffect, ReactNode } from 'react'

export interface AccordionProps {
  title: string
  children: ReactNode
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState('0px')

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [open])

  return (
    <div className="border rounded-2xl mb-2  border-border shadow-sm">
      <button
        className="w-full p-4 text-left font-medium text-lg flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className='text-3xl -mt-2 font-thin'>{open ? '−' : '+'}</span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="px-4 pb-4 border-t border-border text-foreground-accent text-sm font-medium    ">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion
