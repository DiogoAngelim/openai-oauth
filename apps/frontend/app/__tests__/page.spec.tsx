import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('renders the heading and login link', () => {
    render(<Home />)
    expect(screen.getByText('OpenAI SaaS Demo')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /login with google/i })
    ).toBeInTheDocument()
  })
})
