import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "../style/style.css"
import ProviderExport from '@/redux/Provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'アステムの掲示板',
  description: 'みんなをお知らせしましょう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderExport>
          {children}
        </ProviderExport>
      </body>
    </html>
  )
}
