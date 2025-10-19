import { ReactNode } from 'react'

interface ContentContainerProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'narrow'
}

export function ContentContainer({ 
  children, 
  className = '', 
  variant = 'default' 
}: ContentContainerProps) {
  const maxWidth = variant === 'narrow' ? 'max-w-content-narrow' : 'max-w-content'
  
  return (
    <div className={`${maxWidth} mx-auto px-4 ${className}`}>
      {children}
    </div>
  )
}