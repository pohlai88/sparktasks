import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders SparkTasks header', () => {
    render(<App />);

    expect(screen.getByText('SparkTasks')).toBeInTheDocument();
    expect(
      screen.getByText(/Storage-neutral, local-first task platform/)
    ).toBeInTheDocument();
  });

  it('displays the three main columns', () => {
    render(<App />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows add task button', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: /add your first task/i })
    ).toBeInTheDocument();
  });
});
