import React from 'react'
import { render, screen } from '@testing-library/react'
import Onboarding from './page'
describe('Onboarding', () => {
  it('renders onboarding message and link', () => {
    render(<Onboarding />)
    expect(screen.getByText(/welcome to openai saas/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to chat/i })).toBeInTheDocument()
  })
})
