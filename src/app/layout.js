import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fragments',
  description: 'A web app that puts fragments to the cloud',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`mx-15 my-2 ${inter.className}`}>{children}</body>
    </html>
  )
}
