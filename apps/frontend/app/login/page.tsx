'// eslint-disable @typescript-eslint/strict-boolean-expressions'
'use client'
import { useEffect, useState } from 'react'

export default function Login (): React.ReactElement {
  useEffect(() => {
    window.location.href = `${(typeof process.env.NEXT_PUBLIC_BACKEND_URL === 'string' && process.env.NEXT_PUBLIC_BACKEND_URL !== '' ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:4000')}/auth/google`
  }, [])
  const [email, setEmail] = useState<string>('')
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <form className='w-full max-w-md p-4 bg-gray-100 rounded shadow'>
        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
        <input
          type='email'
          className='w-full p-2 border rounded mb-2'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded'
        >
          Login
        </button>
      </form>
    </main>
  )
}
