import React from 'react'
import Link from 'next/link'

export default function Home (): React.ReactElement {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <h1 className='text-3xl font-bold mb-4'>OpenAI SaaS Demo</h1>
      <Link
        href='/login'
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      >
        Login with Google
      </Link>
    </main>
  )
}
