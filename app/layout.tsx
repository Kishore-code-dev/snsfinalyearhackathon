import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'
import NoiseOverlay from '@/components/ui/NoiseOverlay'
import VisualMouseLayer from '@/components/visual-control/VisualMouseLayer'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'XYLO AI | Autonomous Invoice Intelligence',
  description: 'Next-generation AI agent system for autonomous invoice processing and fraud detection.',
}

export const viewport = {
  themeColor: '#020002',

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
      <body className={clsx(outfit.variable, 'font-sans antialiased h-full overflow-hidden bg-[#020002] text-white selection:bg-purple-500 selection:text-white')}>
        <NoiseOverlay />
        <VisualMouseLayer />
        {children}
      </body>
    </html>
  )
}
