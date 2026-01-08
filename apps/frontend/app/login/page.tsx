'use client'
import React, { useEffect, useState } from 'react'
import { redirectToAuth } from './redirectToAuth'

export default function Login (): React.ReactElement {
  useEffect(() => {
    redirectToAuth(
      `${typeof process.env.NEXT_PUBLIC_BACKEND_URL === 'string' && process.env.NEXT_PUBLIC_BACKEND_URL !== '' ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:4000'}/auth/google`
    )
  }, [])
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <div className='text-lg text-gray-700'>Redirecting to Google login...</div>
    </main>
  )
}
