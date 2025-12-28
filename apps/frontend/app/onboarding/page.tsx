
import React from 'react'
import Link from 'next/link'

export default function Onboarding(): React.ReactElement {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to OpenAI SaaS!</h1>
      <p className='mb-4'>
        Your organization has been created. Invite teammates and start using AI
        features.
      </p>
      <Link
        href='/chat'
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      >
        Go to Chat
      </Link>
    </main>
  )
}
