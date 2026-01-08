import React from 'react'
// Custom 404 page for Next.js App Router
export default function NotFound (): JSX.Element {
  return (
    <html>
      <body className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800'>
        <h2 className='text-2xl font-bold mb-4'>404 - Page Not Found</h2>
        <p className='mb-4'>Sorry, the page you are looking for does not exist.</p>
        <a href='/' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Go Home</a>
      </body>
    </html>
  )
}
