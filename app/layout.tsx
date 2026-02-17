import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'
import NoiseOverlay from '@/components/ui/NoiseOverlay'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'XYLO | Biological Supply Chain Web App',
  description: 'Living Intelligence for modern supply chains. A Next.js Web Application.',
}

export const viewport = {
  themeColor: '#020005',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming to feel like a native app
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={clsx(outfit.variable, 'font-sans antialiased h-full overflow-hidden bg-[#020005] text-white selection:bg-cyan-500 selection:text-black')}>
        <NoiseOverlay />
        {children}
      </body>
    </html>
  )
}
