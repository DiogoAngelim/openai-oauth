import React from 'react'
import { render } from '@testing-library/react'
import RootLayout from '../layout'

describe('RootLayout', () => {
  it('renders children', () => {
    // Suppress React <html> nesting warning for this test
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    const { container } = render(<RootLayout>hello</RootLayout>)
    const body = container.querySelector('body')
    expect(body).toBeTruthy()
    expect(body?.textContent).toContain('hello')
    errorSpy.mockRestore()
  })
})
