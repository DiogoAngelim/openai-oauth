// Global error boundary for Next.js App Router
"use client"
import React from "react"
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error)
  }, [error])

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="mb-4">{error.message}</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
