import React from 'react'

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Chat from './page'

// EventSource mock with assignable onmessage/onerror
let eventSourceInstances = []
const eventSourceMock = jest.fn().mockImplementation(() => {
  const instance = {
    onmessage: null,
    onerror: null,
    close: jest.fn()
  }
  eventSourceInstances.push(instance)
  return instance
})
global.EventSource = eventSourceMock
global.fetch = jest.fn(async () => await Promise.resolve({ ok: true }))
beforeEach(() => {
  eventSourceInstances = []
})

describe('Chat', () => {
  // Removed redundant test: 'closes existing EventSource if present on submit'.

  it('handles fetch failure gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(async () => await Promise.reject(new Error('fail')))
    render(<Chat />)
    fireEvent.change(screen.getByPlaceholderText('Ask something...'), { target: { value: 'foo' } })
    fireEvent.click(screen.getByRole('button'))
    // No uncaught error should occur, and button should eventually not be loading
    const button = screen.getByRole('button')
    await waitFor(() => expect(button).not.toHaveTextContent(/loading/i))
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chat form and response area', () => {
    render(<Chat />)
    expect(screen.getByPlaceholderText('Ask something...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    expect(screen.getByText(/messages/i)).toBeInTheDocument()
  })

  it('updates prompt and calls handleSubmit', async () => {
    render(<Chat />)
    const textarea = screen.getByPlaceholderText('Ask something...')
    fireEvent.change(textarea, { target: { value: 'hello world' } })
    expect(textarea).toHaveValue('hello world')
    const button = screen.getByRole('button', { name: /send/i })
    fireEvent.click(button)
    // Button should show loading
    await waitFor(() => expect(button).toHaveTextContent(/loading/i))
    // fetch should be called
    expect(global.fetch).toHaveBeenCalled()
    // EventSource should be created
    expect(global.EventSource).toHaveBeenCalled()
  })

  it('renders response and message count', async () => {
    render(<Chat />)
    fireEvent.change(screen.getByPlaceholderText('Ask something...'), { target: { value: 'foo' } })
    fireEvent.click(screen.getByRole('button'))
    // Simulate EventSource message after assignment
    const esInstance = eventSourceInstances[0]
    // Assign a function to onmessage if not already
    if (typeof esInstance.onmessage !== 'function') {
      esInstance.onmessage = jest.fn()
    }
    // Call the assigned onmessage handler inside act
    await act(async () => {
      esInstance.onmessage({ data: 'hello world' })
    })
    await waitFor(() => expect(screen.getByText('hello world')).toBeInTheDocument())
    expect(screen.getByText(/2 messages/)).toBeInTheDocument()
  })

  it('handles EventSource error and closes', async () => {
    render(<Chat />)
    fireEvent.change(screen.getByPlaceholderText('Ask something...'), { target: { value: 'foo' } })
    fireEvent.click(screen.getByRole('button'))
    const esInstance = eventSourceInstances[0]
    if (typeof esInstance.onerror !== 'function') {
      esInstance.onerror = jest.fn()
    }
    await act(async () => {
      esInstance.onerror()
    })
    await waitFor(() => expect(esInstance.close).toHaveBeenCalled())
  })

  it('closes previous EventSource on new submit', async () => {
    render(<Chat />)
    fireEvent.change(screen.getByPlaceholderText('Ask something...'), { target: { value: 'foo' } })
    fireEvent.click(screen.getByRole('button'))
    const esInstance1 = eventSourceInstances[0]
    // End loading by simulating error on first EventSource
    await act(async () => {
      esInstance1.onerror()
    })
    fireEvent.change(screen.getByPlaceholderText('Ask something...'), { target: { value: 'bar' } })
    fireEvent.click(screen.getByRole('button'))
    // Wait for the second EventSource to be created
    await waitFor(() => {
      expect(eventSourceInstances.length).toBeGreaterThan(1)
    })
    expect(esInstance1.close).toHaveBeenCalled()
  })
})
