import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock redirectToAuth before importing the component
let mockRedirectToAuth: jest.Mock;
jest.mock('./redirectToAuth', () => ({
  redirectToAuth: (...args: any[]) => mockRedirectToAuth(...args),
}));
import Login from './page';


describe('Login', () => {
  beforeEach(() => {
    mockRedirectToAuth = jest.fn();
  });

  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects on mount (useEffect)', () => {
    render(<Login />);
    expect(mockRedirectToAuth).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/google/));
  });

  it('updates email input', () => {
    render(<Login />);
    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('submits the form', () => {
    render(<Login />);
    // getByRole('form') is not supported, so use querySelector
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    if (form) {
      fireEvent.submit(form);
      // No error thrown, form is present
      expect(form).toBeInTheDocument();
    }
  });
});
