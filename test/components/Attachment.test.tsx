/**
 * @jest-environment jsdom
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Attachment } from '@/components/ui/Attachment';

// Test environment setup
beforeAll(() => {
  // Test environment initialized
  // Default test date: 2025-08-15T10:00:00.000Z
  // Environment: test
});

describe('Attachment Component', () => {
  describe('Basic Functionality', () => {
    it('renders with required props', () => {
      render(<Attachment title='Test Document.pdf' />);

      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByText('Test Document.pdf')).toBeInTheDocument();
    });

    it('renders with custom title and metadata', () => {
      const metadata = {
        fileName: 'financial-report.pdf',
        fileSize: 2048000, // 2MB
        uploadedAt: new Date('2024-01-20T22:30:00Z'),
        uploadedBy: 'John Doe',
        description: 'Q4 Financial Report',
        downloadCount: 25,
      };

      render(
        <Attachment
          title='Financial Report Q4 2024'
          type='document'
          status='complete'
          metadata={metadata}
        />
      );

      expect(screen.getByText('Financial Report Q4 2024')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('2.0 MB')).toBeInTheDocument();
      expect(screen.getByText('25 downloads')).toBeInTheDocument();
    });

    it('handles click events correctly', () => {
      const handleClick = vi.fn();
      render(<Attachment title='Clickable Attachment' onClick={handleClick} />);

      const attachment = screen.getByRole('button');
      fireEvent.click(attachment);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Attachment title='Keyboard Test' onClick={handleClick} />);

      const attachment = screen.getByRole('button');
      await user.tab();
      expect(attachment).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Attachment Types', () => {
    it('renders file type with correct icon color', () => {
      render(<Attachment title='Document.txt' type='file' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-blue-600');
    });

    it('renders link type with correct icon color', () => {
      render(<Attachment title='External Link' type='link' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders image type with correct icon color', () => {
      render(<Attachment title='Photo.jpg' type='image' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-purple-600');
    });

    it('renders document type with correct icon color', () => {
      render(<Attachment title='Report.pdf' type='document' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-red-600');
    });

    it('renders video type with correct icon color', () => {
      render(<Attachment title='Video.mp4' type='video' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-orange-600');
    });

    it('renders audio type with correct icon color', () => {
      render(<Attachment title='Audio.mp3' type='audio' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-pink-600');
    });

    it('renders archive type with correct icon color', () => {
      render(<Attachment title='Archive.zip' type='archive' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-gray-600');
    });

    it('renders spreadsheet type with correct icon color', () => {
      render(<Attachment title='Data.xlsx' type='spreadsheet' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders presentation type with correct icon color', () => {
      render(<Attachment title='Slides.pptx' type='presentation' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-orange-600');
    });

    it('renders unknown type with correct icon color', () => {
      render(<Attachment title='Unknown.xyz' type='unknown' />);

      const icon = screen.getByRole('article').querySelector('svg');
      expect(icon).toHaveClass('text-gray-600');
    });
  });

  describe('Attachment Status', () => {
    it('renders uploading status correctly', () => {
      render(<Attachment title='Upload Test' status='uploading' />);

      expect(screen.getByText('Uploading')).toBeInTheDocument();
    });

    it('renders complete status correctly', () => {
      render(<Attachment title='Complete Test' status='complete' />);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('renders error status correctly', () => {
      render(<Attachment title='Error Test' status='error' />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders pending status correctly', () => {
      render(<Attachment title='Pending Test' status='pending' />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders compact size correctly', () => {
      render(<Attachment title='Compact Test' size='compact' />);

      const attachment = screen.getByRole('article');
      expect(attachment).toBeInTheDocument();
    });

    it('renders default size correctly', () => {
      render(<Attachment title='Default Test' size='default' />);

      const attachment = screen.getByRole('article');
      expect(attachment).toBeInTheDocument();
    });

    it('renders detailed size correctly', () => {
      const metadata = {
        description: 'This is a detailed description of the attachment',
        thumbnailUrl: '/test-thumbnail.jpg',
      };

      render(
        <Attachment title='Detailed Test' size='detailed' metadata={metadata} />
      );

      expect(
        screen.getByText('This is a detailed description of the attachment')
      ).toBeInTheDocument();
      expect(
        screen.getByAltText('Preview of Detailed Test')
      ).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('shows preview button when showPreview is true', () => {
      const onPreview = vi.fn();
      render(
        <Attachment
          title='Preview Test'
          showPreview={true}
          onPreview={onPreview}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(screen.getByLabelText('Preview attachment')).toBeInTheDocument();
    });

    it('hides preview button when showPreview is false', () => {
      render(<Attachment title='No Preview Test' showPreview={false} />);

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(
        screen.queryByLabelText('Preview attachment')
      ).not.toBeInTheDocument();
    });

    it('calls onPreview when preview button is clicked', () => {
      const onPreview = vi.fn();
      render(<Attachment title='Preview Click Test' onPreview={onPreview} />);

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      const previewButton = screen.getByLabelText('Preview attachment');
      fireEvent.click(previewButton);

      expect(onPreview).toHaveBeenCalledTimes(1);
    });

    it('shows download button when showDownload is true', () => {
      const onDownload = vi.fn();
      render(
        <Attachment
          title='Download Test'
          showDownload={true}
          onDownload={onDownload}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(screen.getByLabelText('Download attachment')).toBeInTheDocument();
    });

    it('calls onDownload when download button is clicked', () => {
      const onDownload = vi.fn();
      render(
        <Attachment title='Download Click Test' onDownload={onDownload} />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      const downloadButton = screen.getByLabelText('Download attachment');
      fireEvent.click(downloadButton);

      expect(onDownload).toHaveBeenCalledTimes(1);
    });

    it('shows remove button when showRemove is true', () => {
      const onRemove = vi.fn();
      render(
        <Attachment title='Remove Test' showRemove={true} onRemove={onRemove} />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(screen.getByLabelText('Remove attachment')).toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', () => {
      const onRemove = vi.fn();
      render(
        <Attachment
          title='Remove Click Test'
          showRemove={true}
          onRemove={onRemove}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      const removeButton = screen.getByLabelText('Remove attachment');
      fireEvent.click(removeButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('prevents event propagation on action button clicks', () => {
      const onClick = vi.fn();
      const onPreview = vi.fn();
      render(
        <Attachment
          title='Propagation Test'
          onClick={onClick}
          onPreview={onPreview}
        />
      );

      const attachment = screen.getByRole('button');
      fireEvent.mouseEnter(attachment);

      const previewButton = screen.getByLabelText('Preview attachment');
      fireEvent.click(previewButton);

      expect(onPreview).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Special Indicators', () => {
    it('shows external link indicator when isExternal is true', () => {
      render(<Attachment title='External Test' isExternal={true} />);

      const externalIcon = screen
        .getByRole('article')
        .querySelector('svg[class*="inline-block"]');
      expect(externalIcon).toBeInTheDocument();
    });

    it('shows secure indicator when metadata.isSecure is true', () => {
      const metadata = { isSecure: true };
      render(<Attachment title='Secure Test' metadata={metadata} />);

      const secureIcon = screen.getByLabelText('Secure');
      expect(secureIcon).toBeInTheDocument();
    });

    it('shows expiration warning for expired attachments', () => {
      const metadata = {
        expiresAt: new Date('2025-01-01T06:59:00Z'),
      };
      render(<Attachment title='Expired Test' metadata={metadata} />);

      expect(screen.getByText(/Expired on/)).toBeInTheDocument();
    });
  });

  describe('Upload Progress', () => {
    it('shows progress bar when status is uploading', () => {
      render(
        <Attachment
          title='Upload Progress Test'
          status='uploading'
          progress={50}
        />
      );

      expect(screen.getByText('50% complete')).toBeInTheDocument();
      expect(screen.getByLabelText('Upload progress: 50%')).toBeInTheDocument();
    });

    it('updates progress bar width based on progress value', () => {
      render(
        <Attachment
          title='Progress Width Test'
          status='uploading'
          progress={75}
        />
      );

      const progressBar = screen.getByLabelText('Upload progress: 75%');
      expect(progressBar).toHaveStyle('width: 75%');
    });
  });

  describe('States and Interactions', () => {
    it('applies disabled state correctly', () => {
      const onClick = vi.fn();
      render(
        <Attachment title='Disabled Test' disabled={true} onClick={onClick} />
      );

      const attachment = screen.getByRole('button');
      expect(attachment).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(attachment);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('shows loading state correctly', () => {
      render(<Attachment title='Loading Test' loading={true} />);

      const attachment = screen.getByRole('article');
      expect(attachment).toHaveClass('opacity-75');
    });

    it('does not trigger actions when disabled', () => {
      const onPreview = vi.fn();
      render(
        <Attachment
          title='Disabled Actions Test'
          disabled={true}
          onPreview={onPreview}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      const previewButton = screen.getByLabelText('Preview attachment');
      fireEvent.click(previewButton);

      expect(onPreview).not.toHaveBeenCalled();
    });

    it('does not trigger actions when loading', () => {
      const onDownload = vi.fn();
      render(
        <Attachment
          title='Loading Actions Test'
          loading={true}
          onDownload={onDownload}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      const downloadButton = screen.getByLabelText('Download attachment');
      fireEvent.click(downloadButton);

      expect(onDownload).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Attachment title='ARIA Test' />);

      const attachment = screen.getByRole('article');
      expect(attachment).toHaveAttribute('aria-label', 'Attachment: ARIA Test');
    });

    it('uses article role when not clickable', () => {
      render(<Attachment title='Article Role Test' />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('uses button role when clickable', () => {
      const onClick = vi.fn();
      render(<Attachment title='Button Role Test' onClick={onClick} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has proper labels for action buttons', () => {
      const onPreview = vi.fn();
      const onDownload = vi.fn();
      const onRemove = vi.fn();

      render(
        <Attachment
          title='Action Labels Test'
          onPreview={onPreview}
          onDownload={onDownload}
          onRemove={onRemove}
          showRemove={true}
        />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(screen.getByLabelText('Preview attachment')).toBeInTheDocument();
      expect(screen.getByLabelText('Download attachment')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove attachment')).toBeInTheDocument();
    });

    it('hides decorative icons from screen readers', () => {
      render(<Attachment title='Decorative Icons Test' />);

      const decorativeIcons = screen
        .getByRole('article')
        .querySelectorAll('svg[aria-hidden="true"]');
      expect(decorativeIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Thumbnails and Media', () => {
    it('renders thumbnail in detailed view', () => {
      const metadata = { thumbnailUrl: '/test-thumbnail.jpg' };
      render(
        <Attachment
          title='Thumbnail Test'
          size='detailed'
          metadata={metadata}
        />
      );

      expect(
        screen.getByAltText('Preview of Thumbnail Test')
      ).toBeInTheDocument();
    });

    it('does not render thumbnail in compact/default views', () => {
      const metadata = { thumbnailUrl: '/test-thumbnail.jpg' };

      render(
        <Attachment
          title='No Thumbnail Compact'
          size='compact'
          metadata={metadata}
        />
      );
      expect(
        screen.queryByAltText('Preview of No Thumbnail Compact')
      ).not.toBeInTheDocument();

      render(
        <Attachment
          title='No Thumbnail Default'
          size='default'
          metadata={metadata}
        />
      );
      expect(
        screen.queryByAltText('Preview of No Thumbnail Default')
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom Props and Styling', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Attachment ref={ref} title='Ref Test' />);

      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<Attachment title='Custom Class' className='custom-attachment' />);

      const attachment = screen.getByRole('article');
      expect(attachment).toHaveClass('custom-attachment');
    });

    it('applies custom style', () => {
      render(
        <Attachment title='Custom Style' style={{ backgroundColor: 'red' }} />
      );

      const attachment = screen.getByRole('article');
      // Browser converts 'red' to rgb format
      expect(attachment).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('renders custom actions', () => {
      const customAction = <button>Custom Action</button>;
      render(
        <Attachment title='Custom Actions' customActions={customAction} />
      );

      const attachment = screen.getByRole('article');
      fireEvent.mouseEnter(attachment);

      expect(
        screen.getByRole('button', { name: /custom action/i })
      ).toBeInTheDocument();
    });
  });

  describe('File Size Formatting', () => {
    const testCases = [
      { bytes: 0, expected: '0 Bytes' },
      { bytes: 1024, expected: '1.0 KB' },
      { bytes: 1048576, expected: '1.0 MB' },
      { bytes: 1073741824, expected: '1.0 GB' },
      { bytes: 2560000, expected: '2.4 MB' },
    ];

    testCases.forEach(({ bytes, expected }) => {
      it(`formats ${bytes} bytes as ${expected}`, () => {
        const metadata = { fileSize: bytes };
        render(<Attachment title='Size Test' metadata={metadata} />);

        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Date Formatting', () => {
    it('formats upload date correctly', () => {
      const metadata = {
        uploadedAt: new Date('2024-06-15T14:30:00Z'),
      };
      render(<Attachment title='Date Test' metadata={metadata} />);

      expect(screen.getByText('Jun 15, 2024, 02:30 PM')).toBeInTheDocument();
    });
  });
});
