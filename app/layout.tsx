import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Message Board',
  description: 'A simple message board app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}