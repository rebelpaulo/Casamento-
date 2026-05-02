import type { Metadata, Viewport } from "next"
import { Playfair_Display, Caveat } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Paulo + Mória — A festa que nos aconteceu",
  description:
    "Convite privado para a renovação de votos do Paulo e da Mória. Junta-te a nós num dia de celebração, amor e memórias.",
}

export const viewport: Viewport = {
  themeColor: "#f3e9d2",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${playfair.variable} ${caveat.variable} bg-background`}>
      <body className="min-h-dvh font-serif antialiased text-foreground">{children}</body>
    </html>
  )
}
