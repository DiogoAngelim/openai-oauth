import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Login from './page'
// Mock redirectToAuth before importing the component
let mockRedirectToAuth: jest.Mock
jest.mock('./redirectToAuth', () => ({
  redirectToAuth: (...args: any[]) => mockRedirectToAuth(...args)
}))

describe('Login', () => {
  it('redirects with custom NEXT_PUBLIC_BACKEND_URL', () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'https://custom-backend'
    render(<Login />)
    expect(mockRedirectToAuth).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/custom-backend\/auth\/google/)
    )
    delete process.env.NEXT_PUBLIC_BACKEND_URL
  })
  beforeEach(() => {
    mockRedirectToAuth = jest.fn()
  })


  it('redirects on mount (useEffect)', () => {
    render(<Login />)
    expect(mockRedirectToAuth).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/google/)
    )
  })


})
