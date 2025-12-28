import React from 'react'
import { render, screen } from '@testing-library/react'
import OrgManagement from './page'
describe('OrgManagement', () => {
  it('renders organization members', () => {
    render(<OrgManagement />)
    expect(screen.getByText('owner@example.com')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('OWNER')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })
})
