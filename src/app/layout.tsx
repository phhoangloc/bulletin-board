import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import "../style/style.css"
import ProviderExport from '@/redux/Provider'
const zen = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ["300", "400", "500", "700", "900"]
})
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
      <body className={zen.className}>
        <ProviderExport>
          {children}
        </ProviderExport>
      </body>
    </html>
  )
}
