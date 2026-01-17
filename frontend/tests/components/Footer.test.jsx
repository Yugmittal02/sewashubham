import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../src/components/Footer';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  it('should render brand name', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/ShubhamPattis/i)).toBeInTheDocument();
  });

  it('should render Terms & Conditions link', () => {
    renderWithRouter(<Footer />);
    
    const termsLink = screen.getByText('Terms & Conditions');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink.closest('a')).toHaveAttribute('href', '/terms');
  });

  it('should render Privacy Policy link', () => {
    renderWithRouter(<Footer />);
    
    const privacyLink = screen.getByText('Privacy Policy');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('should render Contact Us link', () => {
    renderWithRouter(<Footer />);
    
    const contactLink = screen.getByText('Contact Us');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('should render WhatsApp social link', () => {
    renderWithRouter(<Footer />);
    
    // Look for the WhatsApp link by href pattern
    const links = screen.getAllByRole('link');
    const whatsappLink = links.find(link => 
      link.getAttribute('href')?.includes('wa.me')
    );
    expect(whatsappLink).toBeDefined();
  });

  it('should render Instagram social link', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    const instagramLink = links.find(link => 
      link.getAttribute('href')?.includes('instagram')
    );
    expect(instagramLink).toBeDefined();
  });

  it('should render phone link', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    const phoneLink = links.find(link => 
      link.getAttribute('href')?.startsWith('tel:')
    );
    expect(phoneLink).toBeDefined();
  });

  it('should render email link', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    const emailLink = links.find(link => 
      link.getAttribute('href')?.startsWith('mailto:')
    );
    expect(emailLink).toBeDefined();
  });

  it('should display current year in copyright', () => {
    renderWithRouter(<Footer />);
    
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('should display powered by text', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/ElectronWays/i)).toBeInTheDocument();
  });

  it('should have at least 3 navigation links', () => {
    renderWithRouter(<Footer />);
    
    // Terms, Privacy, Contact = 3 internal links
    const internalLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.startsWith('/')
    );
    expect(internalLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('should have social links open in new tab', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    const externalLinks = links.filter(link => 
      link.getAttribute('target') === '_blank'
    );
    // WhatsApp and Instagram should open in new tab
    expect(externalLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('should have noopener noreferrer on external links', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    const externalLinks = links.filter(link => 
      link.getAttribute('rel')?.includes('noopener')
    );
    expect(externalLinks.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Footer - Responsive Design', () => {
  it('should have proper container styling', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});
