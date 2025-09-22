import { Chivo_Mono } from "next/font/google"
import localFont from "next/font/local"
import "styles/tailwind.css"

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-chivo-mono",
})

const universitySans = localFont({
  src: [
    {
      path: "./fonts/UniversitySans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/UniversitySans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/UniversitySans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/UniversitySans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-university-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${universitySans.variable} ${chivoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
