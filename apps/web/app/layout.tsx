import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SparkTasks Railway - Fortune 500 Project Management',
  description: 'PMBOK-compliant project management platform with Railway metaphor for enterprise teams',
  keywords: ['project management', 'PMBOK', 'enterprise', 'railway'],
  authors: [{ name: 'SparkTasks Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
