"use client"
import React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get("accessToken")
    const user = params.get("user")
    const org = params.get("org")
    const role = params.get("role")
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
      if (user) localStorage.setItem("user", user)
      if (org) localStorage.setItem("org", org)
      if (role) localStorage.setItem("role", role)
      // Redirect to chat page or home
      router.replace("/chat")
    } else {
      // Redirect to login if no token
      router.replace("/login")
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Authenticating...</div>
    </main>
  )
}
