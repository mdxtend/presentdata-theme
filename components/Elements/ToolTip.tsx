import React, { ReactNode, useState } from 'react'

interface ToolTipProps {
    content: ReactNode
    children: ReactNode
}

const ToolTip = ({ content, children }: ToolTipProps) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            className='inline-block relative'
        >
            {children}
            {isVisible && (
                <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 my-2 z-[200] whitespace-nowrap pt-1 pb-[5px] px-3 text-[11px] font-medium bg-background-secondary rounded-lg flex items-center justify-center"
                >
                    {content}
                </div>
            )}
        </div>
    )
}

export default ToolTip
