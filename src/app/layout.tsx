import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'DatCore — Plataforma de Gobierno de Datos',
  description: 'Gobierno de datos para empresas que quieren cumplir',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.className} ${cormorant.variable} antialiased bg-background text-on-background`}>
        {children}
      </body>
    </html>
  )
}
