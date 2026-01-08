'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback (): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const user = params.get('user')
    const org = params.get('org')
    const role = params.get('role')
    if (typeof accessToken === 'string' && accessToken !== '') {
      localStorage.setItem('accessToken', accessToken)
      if (typeof user === 'string' && user !== '') localStorage.setItem('user', user)
      if (typeof org === 'string' && org !== '') localStorage.setItem('org', org)
      if (typeof role === 'string' && role !== '') localStorage.setItem('role', role)
      // Redirect to chat page or home
      router.replace('/chat')
    } else {
      // Redirect to login if no token
      router.replace('/login')
    }
  }, [router])

  return (
    <main className='min-h-screen flex items-center justify-center'>
      <div className='text-lg'>Authenticating...</div>
    </main>
  )
}
