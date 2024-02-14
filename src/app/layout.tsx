import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import "../style/style.css"
import ProviderExport from '@/redux/Provider'
const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'おおさかパルコップ掲示板',
  description: 'みんなをお知らせしましょう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={notoSansJP.className}>
        <ProviderExport>
          {children}
        </ProviderExport>
      </body>
    </html>
  )
}
