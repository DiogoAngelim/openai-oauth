import React, { ReactNode } from 'react'
import './globals.css'

export default function RootLayout ({
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
