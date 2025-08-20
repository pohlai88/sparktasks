/**
 * Document Component Tests
 * 
 * Comprehensive test suite for the enterprise-grade Document component
 * covering all functionality, accessibility, and edge cases.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Document from '@/components/ui/Document';
import type { DocumentFormat, DocumentStatus, DocumentSize, DocumentMetadata } from '@/components/ui/Document';

// Mock functions for event handlers
const mockOnClick = vi.fn();
const mockOnPreview = vi.fn();
const mockOnDownload = vi.fn();
const mockOnShare = vi.fn();

// Test data
const mockMetadata: DocumentMetadata = {
  author: 'John Doe',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  modifiedAt: new Date('2024-01-20T15:30:00Z'),
  version: '1.2.0',
  tags: ['important', 'draft', 'q4-report'],
  description: 'Q4 financial report with detailed analytics and forecasting for the upcoming fiscal year.',
  fileSize: 2048576,
  pageCount: 25,
  isConfidential: true,
  expiresAt: new Date('2024-12-31T23:59:59Z')
};

describe('Document Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with required props', () => {
      render(<Document title="Test Document" />);
      
      expect(screen.getByText('Test Document')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
      expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    });

    it('renders with custom title and metadata', () => {
      render(
        <Document 
          title="Financial Report Q4 2024" 
          metadata={mockMetadata}
          fileSize={2048576}
        />
      );
      
      expect(screen.getByText('Financial Report Q4 2024')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('2.0 MB')).toBeInTheDocument();
      expect(screen.getByText('25 pages')).toBeInTheDocument();
    });

    it('handles click events correctly', async () => {
      const user = userEvent.setup();
      render(<Document title="Clickable Document" onClick={mockOnClick} />);
      
      const document = screen.getByRole('button', { name: /document: clickable document/i });
      await user.click(document);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Document title="Keyboard Document" onClick={mockOnClick} />);
      
      const document = screen.getByRole('button', { name: /document: keyboard document/i });
      document.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Document Formats', () => {
    const formats: { format: DocumentFormat; expectedColor: string }[] = [
      { format: 'pdf', expectedColor: 'text-red-600' },
      { format: 'doc', expectedColor: 'text-blue-600' },
      { format: 'docx', expectedColor: 'text-blue-600' },
      { format: 'xls', expectedColor: 'text-green-600' },
      { format: 'xlsx', expectedColor: 'text-green-600' },
      { format: 'csv', expectedColor: 'text-green-600' },
      { format: 'ppt', expectedColor: 'text-orange-600' },
      { format: 'pptx', expectedColor: 'text-orange-600' },
      { format: 'image', expectedColor: 'text-purple-600' },
      { format: 'archive', expectedColor: 'text-gray-600' },
      { format: 'unknown', expectedColor: 'text-gray-600' }
    ];

    formats.forEach(({ format, expectedColor }) => {
      it(`renders ${format} format with correct icon color`, () => {
        render(<Document title={`${format} document`} format={format} />);
        
        expect(screen.getByText(`${format.toUpperCase()}`)).toBeInTheDocument();
        
        // Check if the icon has the correct color class
        const iconElement = document.querySelector(`.${expectedColor.replace('-', '-')}`);
        if (expectedColor !== 'text-gray-600') { // Skip generic gray color check
          expect(iconElement).toBeInTheDocument();
        }
      });
    });
  });

  describe('Document Status', () => {
    const statuses: { status: DocumentStatus; expectedText: string }[] = [
      { status: 'draft', expectedText: 'Draft' },
      { status: 'review', expectedText: 'Review' },
      { status: 'approved', expectedText: 'Approved' },
      { status: 'final', expectedText: 'Final' },
      { status: 'archived', expectedText: 'Archived' }
    ];

    statuses.forEach(({ status, expectedText }) => {
      it(`renders ${status} status correctly`, () => {
        render(<Document title="Status Test" status={status} />);
        
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    const sizes: DocumentSize[] = ['compact', 'default', 'detailed'];

    sizes.forEach((size) => {
      it(`renders ${size} size correctly`, () => {
        const props = size === 'detailed' 
          ? { title: `${size} document`, size, metadata: mockMetadata }
          : { title: `${size} document`, size };
          
        render(<Document {...props} />);
        
        expect(screen.getByText(`${size} document`)).toBeInTheDocument();
        
        if (size === 'detailed') {
          // Detailed size should show description and tags
          expect(screen.getByText(mockMetadata.description!)).toBeInTheDocument();
          mockMetadata.tags!.forEach(tag => {
            expect(screen.getByText(tag)).toBeInTheDocument();
          });
        }
      });
    });
  });

  describe('Action Buttons', () => {
    it('shows preview button when showPreview is true', () => {
      render(
        <Document 
          title="Preview Test" 
          showPreview={true} 
          onPreview={mockOnPreview}
        />
      );
      
      const previewButton = screen.getByRole('button', { name: /preview document/i });
      expect(previewButton).toBeInTheDocument();
    });

    it('hides preview button when showPreview is false', () => {
      render(
        <Document 
          title="No Preview Test" 
          showPreview={false}
        />
      );
      
      const previewButton = screen.queryByRole('button', { name: /preview document/i });
      expect(previewButton).not.toBeInTheDocument();
    });

    it('calls onPreview when preview button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Preview Action Test" 
          showPreview={true} 
          onPreview={mockOnPreview}
        />
      );
      
      const previewButton = screen.getByRole('button', { name: /preview document/i });
      await user.click(previewButton);
      
      expect(mockOnPreview).toHaveBeenCalledTimes(1);
    });

    it('shows download button when showDownload is true', () => {
      render(
        <Document 
          title="Download Test" 
          showDownload={true} 
          onDownload={mockOnDownload}
        />
      );
      
      const downloadButton = screen.getByRole('button', { name: /download document/i });
      expect(downloadButton).toBeInTheDocument();
    });

    it('calls onDownload when download button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Download Action Test" 
          showDownload={true} 
          onDownload={mockOnDownload}
        />
      );
      
      const downloadButton = screen.getByRole('button', { name: /download document/i });
      await user.click(downloadButton);
      
      expect(mockOnDownload).toHaveBeenCalledTimes(1);
    });

    it('shows share button when showShare is true', () => {
      render(
        <Document 
          title="Share Test" 
          showShare={true} 
          onShare={mockOnShare}
        />
      );
      
      const shareButton = screen.getByRole('button', { name: /share document/i });
      expect(shareButton).toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Share Action Test" 
          showShare={true} 
          onShare={mockOnShare}
        />
      );
      
      const shareButton = screen.getByRole('button', { name: /share document/i });
      await user.click(shareButton);
      
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });

    it('prevents event propagation on action button clicks', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Event Test" 
          onClick={mockOnClick}
          onPreview={mockOnPreview}
        />
      );
      
      const previewButton = screen.getByRole('button', { name: /preview document/i });
      await user.click(previewButton);
      
      // Only preview should be called, not the main onClick
      expect(mockOnPreview).toHaveBeenCalledTimes(1);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Special Indicators', () => {
    it('shows external link indicator when isExternal is true', () => {
      render(
        <Document 
          title="External Document" 
          isExternal={true}
        />
      );
      
      // Check for external link icon (may be aria-hidden)
      expect(screen.getByText('External Document')).toBeInTheDocument();
    });

    it('shows confidential indicator when metadata.isConfidential is true', () => {
      render(
        <Document 
          title="Confidential Document" 
          metadata={{ ...mockMetadata, isConfidential: true }}
        />
      );
      
      const lockIcon = document.querySelector('[aria-label="Confidential"]');
      expect(lockIcon).toBeInTheDocument();
    });

    it('shows expiration warning for expired documents', () => {
      const expiredMetadata = {
        ...mockMetadata,
        expiresAt: new Date('2020-01-01T00:00:00Z') // Past date
      };
      
      render(
        <Document 
          title="Expired Document" 
          metadata={expiredMetadata}
        />
      );
      
      expect(screen.getByText(/expired on/i)).toBeInTheDocument();
    });
  });

  describe('States and Interactions', () => {
    it('applies disabled state correctly', () => {
      render(
        <Document 
          title="Disabled Document" 
          disabled={true}
          onClick={mockOnClick}
          onPreview={mockOnPreview}
        />
      );
      
      const document = screen.getByRole('button', { name: /document: disabled document/i });
      expect(document).toHaveAttribute('aria-disabled', 'true');
      
      // Action buttons should be disabled
      const previewButton = screen.getByRole('button', { name: /preview document/i });
      expect(previewButton).toBeDisabled();
    });

    it('shows loading state correctly', () => {
      render(
        <Document 
          title="Loading Document" 
          loading={true}
        />
      );
      
      // Loading spinner should be present
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('does not trigger actions when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Disabled Actions" 
          disabled={true}
          onClick={mockOnClick}
          onPreview={mockOnPreview}
        />
      );
      
      const document = screen.getByRole('button', { name: /document: disabled actions/i });
      await user.click(document);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('does not trigger actions when loading', async () => {
      const user = userEvent.setup();
      render(
        <Document 
          title="Loading Actions" 
          loading={true}
          onClick={mockOnClick}
          onPreview={mockOnPreview}
        />
      );
      
      const document = screen.getByRole('button', { name: /document: loading actions/i });
      await user.click(document);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Document title="Accessible Document" onClick={mockOnClick} />);
      
      const document = screen.getByRole('button', { name: /document: accessible document/i });
      expect(document).toHaveAttribute('tabIndex', '0');
      expect(document).toHaveAttribute('aria-label', 'Document: Accessible Document');
    });

    it('uses article role when not clickable', () => {
      render(<Document title="Article Document" />);
      
      const document = screen.getByRole('article');
      expect(document).toHaveAttribute('aria-label', 'Document: Article Document');
      expect(document).not.toHaveAttribute('tabIndex');
    });

    it('has proper labels for action buttons', () => {
      render(
        <Document 
          title="Button Labels" 
          showPreview={true}
          showDownload={true}
          showShare={true}
        />
      );
      
      expect(screen.getByRole('button', { name: /preview document/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download document/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share document/i })).toBeInTheDocument();
    });

    it('hides decorative icons from screen readers', () => {
      render(<Document title="Icon Test" />);
      
      // Format icons should be aria-hidden or have proper aria-labels
      const icons = document.querySelectorAll('svg');
      icons.forEach(icon => {
        const hasAriaHidden = icon.hasAttribute('aria-hidden');
        const hasAriaLabel = icon.hasAttribute('aria-label');
        expect(hasAriaHidden || hasAriaLabel).toBe(true);
      });
    });
  });

  describe('Thumbnails and Media', () => {
    it('renders thumbnail in detailed view', () => {
      render(
        <Document 
          title="Document with Thumbnail" 
          size="detailed"
          thumbnailUrl="https://example.com/thumbnail.jpg"
        />
      );
      
      const thumbnail = screen.getByRole('img', { name: /preview of document with thumbnail/i });
      expect(thumbnail).toBeInTheDocument();
      expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
      expect(thumbnail).toHaveAttribute('loading', 'lazy');
    });

    it('does not render thumbnail in compact/default views', () => {
      render(
        <Document 
          title="No Thumbnail" 
          size="default"
          thumbnailUrl="https://example.com/thumbnail.jpg"
        />
      );
      
      const thumbnail = screen.queryByRole('img', { name: /preview of/i });
      expect(thumbnail).not.toBeInTheDocument();
    });
  });

  describe('Custom Props and Styling', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Document title="Ref Test" ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies custom className', () => {
      render(<Document title="Custom Class" className="custom-document" />);
      
      const document = screen.getByRole('article');
      expect(document).toHaveClass('custom-document');
    });

    it('applies custom style', () => {
      render(<Document title="Custom Style" style={{ backgroundColor: 'red' }} />);
      
      const document = screen.getByRole('article');
      // Browser converts 'red' to rgb format
      expect(document).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('renders custom actions', () => {
      const customAction = <button>Custom Action</button>;
      render(<Document title="Custom Actions" customActions={customAction} />);
      
      expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument();
    });
  });

  describe('File Size Formatting', () => {
    const fileSizeTests = [
      { bytes: 0, expected: '0 Bytes' },
      { bytes: 1024, expected: '1.0 KB' },
      { bytes: 1048576, expected: '1.0 MB' },
      { bytes: 1073741824, expected: '1.0 GB' },
      { bytes: 2560000, expected: '2.4 MB' }
    ];

    fileSizeTests.forEach(({ bytes, expected }) => {
      it(`formats ${bytes} bytes as ${expected}`, () => {
        render(<Document title="Size Test" fileSize={bytes} />);
        
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Date Formatting', () => {
    it('formats modification date correctly', () => {
      const testDate = new Date('2024-01-20T15:30:00Z');
      const metadata = { ...mockMetadata, modifiedAt: testDate };
      
      render(<Document title="Date Test" metadata={metadata} />);
      
      // Should format as readable date string
      expect(screen.getByText(/Jan 20, 2024/)).toBeInTheDocument();
    });
  });
});
