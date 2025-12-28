import React from 'react'
import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

describe('RootLayout', () => {
  it('renders children', () => {
    render(<RootLayout>hello</RootLayout>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})
