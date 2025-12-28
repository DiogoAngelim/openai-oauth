
import React from 'react'
import './globals.css'
import { ReactNode } from 'react'

export default function RootLayout({
  children
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
