import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// Dynamicky importovaný footer
const Footer = dynamic(() => import('@/components/footer').then(mod => ({ default: mod.Footer })), {
  ssr: true
})

export const metadata: Metadata = {
  title: 'Denná šálka kávy',
  description: 'Vaše denné spravodajstvo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text&family=Tinos:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        
        {/* Analytics script - načíta sa až po interakcii používateľa */}
        <Script
          src="https://example.com/analytics.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
