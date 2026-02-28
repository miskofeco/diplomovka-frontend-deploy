'use client'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>

type IntentPrefetchLinkProps = LinkProps &
  AnchorProps & {
    prefetchOnIntent?: boolean
  }

export function IntentPrefetchLink({
  href,
  prefetchOnIntent = true,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: IntentPrefetchLinkProps) {
  const router = useRouter()
  const hrefString = typeof href === 'string' ? href : href.pathname || ''

  const prefetch = useCallback(() => {
    if (!prefetchOnIntent || !hrefString) {
      return
    }
    router.prefetch(hrefString)
  }, [hrefString, prefetchOnIntent, router])

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(event) => {
        prefetch()
        onMouseEnter?.(event)
      }}
      onFocus={(event) => {
        prefetch()
        onFocus?.(event)
      }}
      onTouchStart={(event) => {
        prefetch()
        onTouchStart?.(event)
      }}
      {...props}
    />
  )
}
