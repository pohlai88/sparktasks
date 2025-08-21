import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders Document Component Demo header', () => {
    render(<App />);

    expect(screen.getByText('🚀 Document Component Demo')).toBeInTheDocument();
    expect(
      screen.getByText(/Enterprise-grade document display component/)
    ).toBeInTheDocument();
  });

  it('displays demo controls section', () => {
    render(<App />);

    expect(screen.getByText('Demo Controls')).toBeInTheDocument();
    expect(screen.getByText('Size Variant:')).toBeInTheDocument();
    expect(screen.getByText('Format Filter:')).toBeInTheDocument();
    expect(screen.getByText('Status Filter:')).toBeInTheDocument();
  });

  it('shows document gallery', () => {
    render(<App />);

    expect(
      screen.getByText(/Document Gallery \(\d+ documents\)/)
    ).toBeInTheDocument();
    expect(
      screen.getByText('🏆 Enterprise Features Showcase')
    ).toBeInTheDocument();
  });
});
