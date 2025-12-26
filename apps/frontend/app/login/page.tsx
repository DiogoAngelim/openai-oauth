'use client';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/auth/google`;
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Google OAuth...</p>
    </main>
  );
}
