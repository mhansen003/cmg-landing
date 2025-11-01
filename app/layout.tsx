import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CMG Tools Hub - Employee Portal',
  description: 'Central hub for CMG Financial tools and applications - AI-powered productivity for employees',
  keywords: ['CMG Financial', 'employee tools', 'productivity', 'change management', 'marketing tools'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-dark-500 text-white antialiased">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
