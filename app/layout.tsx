import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:  'unsent letters',
  description: 'send heart warming messages to your loved ones anonymously',
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
