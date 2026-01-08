'use client'
import React, { useState, useRef, useEffect } from 'react'

export default function Chat(): React.ReactElement {
  const [prompt, setPrompt] = useState<string>('')
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [history, setHistory] = useState<any[]>([])
  const eventSourceRef = useRef<EventSource | null>(null)
  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const accessToken = localStorage.getItem('accessToken') || ''
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}/openai/history`
      try {
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setHistory(Array.isArray(data) ? data : [])
        }
      } catch { }
    }
    fetchHistory()
  }, [])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    setResponse('')
    setLoading(true)
    if (eventSourceRef.current !== null) {
      eventSourceRef.current.close()
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}/openai/chat?stream=true`
    let es: EventSource | null = null
    try {
      es = new EventSource(url, { withCredentials: true })
      eventSourceRef.current = es
      es.onmessage = (event: MessageEvent) => {
        // Only display chat response, not token
        try {
          const data = JSON.parse(event.data)
          if (data.choices && data.choices[0] && data.choices[0].message) {
            setResponse((prev) => prev + data.choices[0].message.content)
          }
        } catch {
          // Fallback: display as plain text if not JSON
          setResponse((prev) => prev + String(event.data ?? ''))
        }
      }
      es.onerror = () => {
        setLoading(false)
        es?.close()
      }
      // Get access token from localStorage (or other storage)
      const accessToken = localStorage.getItem('accessToken') || ''
      await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ prompt })
      })
    } catch (err) {
      setLoading(false)
      if (es != null && typeof es.close === 'function') es.close()
    }
  }

  // Ensure operands for + are both strings or numbers
  const messageCount = `${response.split(' ').filter(Boolean).length} words`

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <form
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
        className='w-full max-w-md p-4 bg-gray-100 rounded shadow'
      >
        <textarea
          className='w-full p-2 border rounded mb-2'
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value ?? '')}
          placeholder='Ask something...'
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded'
          disabled={!!loading}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <div className='w-full max-w-md mt-4 p-4 bg-gray-50 rounded shadow min-h-[100px]'>
        <pre>{response}</pre>
        <div className='text-sm text-gray-500 mt-2'>{messageCount}</div>
      </div>
      <div className='w-full max-w-md mt-4 p-4 bg-gray-100 rounded shadow'>
        <h2 className='font-bold mb-2'>Chat History</h2>
        {history.length === 0 ? (
          <div className='text-gray-500'>No history found.</div>
        ) : (
          <ul className='space-y-2'>
            {history.map((msg, idx) => (
              <li key={msg.id || idx} className='border-b pb-2'>
                <div><span className='font-semibold'>Prompt:</span> {msg.prompt}</div>
                <div><span className='font-semibold'>Response:</span> {msg.response}</div>
                <div className='text-xs text-gray-400'>Model: {msg.model} | {msg.createdAt}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
