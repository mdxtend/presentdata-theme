import React, { ReactNode, ReactElement } from 'react'

export interface BadgeProps {
  label: string
  color?: 'gray' | 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'pink'
  icon?: ReactNode
  className?: string
}

const colorMap: Record<string, string> = {
  gray: 'bg-gray-200 text-gray-800',
  green: 'bg-green-200 text-green-800',
  red: 'bg-red-200 text-red-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  blue: 'bg-blue-200 text-blue-800',
  purple: 'bg-purple-200 text-purple-800',
  pink: 'bg-pink-200 text-pink-800'
}

const Badge: React.FC<BadgeProps> = ({ label, color = 'gray', icon, className = '' }) => {
  const baseStyle = 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full'
  const colorStyle = colorMap[color] || colorMap.gray

  return (
    <span className={`${baseStyle} ${colorStyle} ${className} h-6`}>
      {icon && (
        <span className="inline-block align-middle shrink-0 [&>svg]:pt-[1.5px] [&>svg]:-mx-[1.5px] [&>svg]:w-[14px] [&>svg]:h-[14px]">
          {icon}
        </span>
      )}
      {label}
    </span>
  )
}

export default Badge
