import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Paulo & Mória — Convite",
  description: "Convite para a festa que nos aconteceu. Junta-te a nós.",
  openGraph: {
    title: "Paulo & Mória — Convite",
    description: "Convite para a festa que nos aconteceu.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5efe4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}
