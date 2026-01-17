import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ customer: null })
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Welcome from '../../src/pages/Welcome';

describe('Welcome Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render welcome page with brand name', () => {
    renderWithRouter(<Welcome />);
    
    // Check for brand text
    expect(screen.getByText(/Shubham/i)).toBeInTheDocument();
    expect(screen.getByText(/Pattis/i)).toBeInTheDocument();
  });

  it('should display browse menu button', () => {
    renderWithRouter(<Welcome />);
    
    const browseButton = screen.getByRole('button', { name: /browse our menu/i });
    expect(browseButton).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const { container } = renderWithRouter(<Welcome />);
    expect(container).toBeTruthy();
  });

  it('should show bakery tagline', () => {
    renderWithRouter(<Welcome />);
    
    expect(screen.getByText(/Bakery & Cafe/i)).toBeInTheDocument();
  });

  it('should have decorative images', () => {
    renderWithRouter(<Welcome />);
    
    // Check for some decorative images
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
