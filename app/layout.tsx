import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuickResume - Create Your Quick Resume Online',
  description: 'Create, customize, and download your resume easily with our QuickResume. Choose templates, add sections, share, download, and export your resume as a PDF.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
