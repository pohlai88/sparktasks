/**
 * AttachmentDemo Component
 * 
 * Interactive demo showcasing the Attachment component's comprehensive features.
 * Demonstrates all variants, states, and capabilities for enterprise file management.
 */

import React, { useState } from 'react';
import { Attachment } from '@/components/ui/Attachment';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import type { AttachmentType, AttachmentStatus, AttachmentSize } from '@/components/ui/Attachment';

const AttachmentDemo: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<AttachmentSize>('default');
  const [selectedStatus, setSelectedStatus] = useState<AttachmentStatus>('complete');
  const [uploadProgress, setUploadProgress] = useState(75);

  // Sample attachment data
  const sampleAttachments = [
    {
      title: 'Financial Report Q4 2024.pdf',
      type: 'document' as AttachmentType,
      status: 'complete' as AttachmentStatus,
      metadata: {
        fileName: 'financial-report-q4-2024.pdf',
        fileSize: 2048000, // 2MB
        uploadedAt: new Date('2024-01-20T22:30:00Z'),
        uploadedBy: 'John Doe',
        description: 'Comprehensive financial analysis for Q4 2024 including revenue, expenses, and projections.',
        downloadCount: 42,
        isSecure: true
      }
    },
    {
      title: 'Team Photo - Holiday Party.jpg',
      type: 'image' as AttachmentType,
      status: 'complete' as AttachmentStatus,
      metadata: {
        fileName: 'team-photo-holiday-2024.jpg',
        fileSize: 5242880, // 5MB
        uploadedAt: new Date('2024-12-15T18:45:00Z'),
        uploadedBy: 'Sarah Wilson',
        thumbnailUrl: '/api/placeholder/48/48',
        mimeType: 'image/jpeg'
      }
    },
    {
      title: 'API Documentation',
      type: 'link' as AttachmentType,
      status: 'complete' as AttachmentStatus,
      isExternal: true,
      metadata: {
        url: 'https://docs.example.com/api',
        description: 'Complete API reference and integration guide'
      }
    },
    {
      title: 'Presentation Draft.pptx',
      type: 'presentation' as AttachmentType,
      status: 'uploading' as AttachmentStatus,
      metadata: {
        fileName: 'quarterly-presentation-draft.pptx',
        fileSize: 12582912, // 12MB
        uploadedBy: 'Mike Chen'
      }
    },
    {
      title: 'Database Backup.zip',
      type: 'archive' as AttachmentType,
      status: 'error' as AttachmentStatus,
      metadata: {
        fileName: 'db-backup-2024-08-20.zip',
        fileSize: 104857600, // 100MB
        uploadedAt: new Date('2024-08-20T03:00:00Z'),
        uploadedBy: 'System Admin'
      }
    },
    {
      title: 'Sales Data Analysis.xlsx',
      type: 'spreadsheet' as AttachmentType,
      status: 'pending' as AttachmentStatus,
      metadata: {
        fileName: 'sales-analysis-2024.xlsx',
        fileSize: 1572864, // 1.5MB
        uploadedBy: 'Emily Rodriguez',
        expiresAt: new Date('2024-12-31T23:59:59Z')
      }
    }
  ];

  const handlePreview = (title: string) => {
    alert(`Preview: ${title}`);
  };

  const handleDownload = (title: string) => {
    alert(`Download: ${title}`);
  };

  const handleRemove = (title: string) => {
    alert(`Remove: ${title}`);
  };

  const handleProgressUpdate = () => {
    setUploadProgress(prev => prev >= 100 ? 0 : prev + 10);
  };

  return (
    <div className={DESIGN_TOKENS.layout.container}>
      {/* Header */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h1 className={DESIGN_TOKENS.typography.heading.h1}>
          Attachment Component Demo
        </h1>
        <p className={combineTokens(
          DESIGN_TOKENS.typography.body.large,
          DESIGN_TOKENS.semantic.text.muted,
          'mt-2'
        )}>
          Enterprise-grade attachment component with comprehensive file management features.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className={combineTokens(
        'bg-gray-50 rounded-lg p-6 mb-8',
        DESIGN_TOKENS.theme.light.radius.lg
      )}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-4')}>
          Interactive Controls
        </h2>
        
        <div className={`${DESIGN_TOKENS.breakpoints.responsiveGrid} ${DESIGN_TOKENS.spacing.xl}`}>
          {/* Size Control */}
          <div>
            <label htmlFor="size-select" className={combineTokens(
              DESIGN_TOKENS.typography.body.small,
              'font-medium mb-2 block'
            )}>
              Size Variant
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as AttachmentSize)}
              className={combineTokens(
                'w-full px-3 py-2 border border-gray-300 rounded-md',
                DESIGN_TOKENS.theme.light.radius.md
              )}
            >
              <option value="compact">Compact</option>
              <option value="default">Default</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          {/* Status Control */}
          <div>
            <label htmlFor="status-select" className={combineTokens(
              DESIGN_TOKENS.typography.body.small,
              'font-medium mb-2 block'
            )}>
              Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AttachmentStatus)}
              className={combineTokens(
                'w-full px-3 py-2 border border-gray-300 rounded-md',
                DESIGN_TOKENS.theme.light.radius.md
              )}
            >
              <option value="complete">Complete</option>
              <option value="uploading">Uploading</option>
              <option value="pending">Pending</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Progress Control */}
          <div>
            <label htmlFor="progress-control" className={combineTokens(
              DESIGN_TOKENS.typography.body.small,
              'font-medium mb-2 block'
            )}>
              Upload Progress: {uploadProgress}%
            </label>
            <div className={`${DESIGN_TOKENS.layout.flexCenter} ${DESIGN_TOKENS.spacing.sm}`}>
              <input
                id="progress-control"
                type="range"
                min="0"
                max="100"
                value={uploadProgress}
                onChange={(e) => setUploadProgress(Number(e.target.value))}
                className={DESIGN_TOKENS.recipe.listItemContent.base}
              />
              <button
                onClick={handleProgressUpdate}
                className={combineTokens(
                  DESIGN_TOKENS.recipe.button.secondary,
                  'text-xs px-2 py-1'
                )}
              >
                +10%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
          Interactive Example
        </h2>
        <Attachment
          title="Interactive Attachment Demo.pdf"
          type="document"
          status={selectedStatus}
          size={selectedSize}
          {...(selectedStatus === 'uploading' && { progress: uploadProgress })}
          metadata={{
            fileName: 'interactive-demo.pdf',
            fileSize: 3145728, // 3MB
            uploadedAt: new Date(),
            uploadedBy: 'Demo User',
            description: 'This attachment demonstrates all interactive features and can be customized using the controls above.',
            isSecure: true,
            downloadCount: 15
          }}
          onPreview={() => handlePreview('Interactive Demo')}
          onDownload={() => handleDownload('Interactive Demo')}
          onRemove={() => handleRemove('Interactive Demo')}
          showRemove={true}
          onClick={() => alert('Attachment clicked!')}
        />
      </div>

      {/* Sample Attachments Gallery */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
          Attachment Types Gallery
        </h2>
        <div className={`grid ${DESIGN_TOKENS.spacing.lg}`}>
          {sampleAttachments.map((attachment, index) => (
            <Attachment
              key={index}
              title={attachment.title}
              type={attachment.type}
              status={attachment.status}
              size="default"
              metadata={attachment.metadata}
              {...(attachment.isExternal && { isExternal: attachment.isExternal })}
              {...(attachment.status === 'uploading' && { progress: uploadProgress })}
              onPreview={() => handlePreview(attachment.title)}
              onDownload={() => handleDownload(attachment.title)}
              onRemove={() => handleRemove(attachment.title)}
              showRemove={attachment.status === 'error'}
              onClick={() => alert(`Clicked: ${attachment.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Size Comparison */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
          Size Comparison
        </h2>
        <div className={`grid ${DESIGN_TOKENS.spacing.xl}`}>
          {(['compact', 'default', 'detailed'] as AttachmentSize[]).map((size) => (
            <div key={size}>
              <h3 className={combineTokens(
                DESIGN_TOKENS.typography.heading.h4,
                DESIGN_TOKENS.spacing.workspace.paragraphMargin,
                'capitalize'
              )}>
                {size} Size
              </h3>
              <Attachment
                title={`Sample Document - ${size}.pdf`}
                type="document"
                status="complete"
                size={size}
                metadata={{
                  fileName: `sample-${size}.pdf`,
                  fileSize: 2048000,
                  uploadedAt: new Date('2024-08-20T10:30:00Z'),
                  uploadedBy: 'Demo User',
                  ...(size === 'detailed' && { 
                    description: `This is a detailed view showing the full description and thumbnail for the ${size} size variant.`,
                    thumbnailUrl: '/api/placeholder/48/48'
                  }),
                  downloadCount: 25,
                  isSecure: true
                }}
                onPreview={() => handlePreview(`${size} sample`)}
                onDownload={() => handleDownload(`${size} sample`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feature Showcase */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
          Feature Showcase
        </h2>
        
        <div className={`grid ${DESIGN_TOKENS.spacing.xl}`}>
          {/* Disabled State */}
          <div>
            <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
              Disabled State
            </h3>
            <Attachment
              title="Disabled Attachment.pdf"
              type="document"
              status="complete"
              disabled={true}
              metadata={{ fileSize: 1024000 }}
              onPreview={() => {}}
              onDownload={() => {}}
            />
          </div>

          {/* Loading State */}
          <div>
            <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, 'mb-2')}>
              Loading State
            </h3>
            <Attachment
              title="Loading Attachment.pdf"
              type="document"
              status="complete"
              loading={true}
              metadata={{ fileSize: 1024000 }}
              onPreview={() => {}}
              onDownload={() => {}}
            />
          </div>

          {/* Custom Styling */}
          <div>
            <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
              Custom Styling
            </h3>
            <Attachment
              title="Custom Styled Attachment.pdf"
              type="document"
              status="complete"
              className={`border-2 ${DESIGN_TOKENS.theme.light.border.focus} ${DESIGN_TOKENS.theme.light.surface.accent}`}
              metadata={{ fileSize: 1024000 }}
              onPreview={() => {}}
              onDownload={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className={DESIGN_TOKENS.spacing.workspace.titleMargin}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, DESIGN_TOKENS.spacing.workspace.subtitleMargin)}>
          Usage Examples
        </h2>
        
        <div className={DESIGN_TOKENS.spacing.workspace.pageSpacing}>
          <div className={combineTokens(
            DESIGN_TOKENS.theme.dark.surface.base,
            DESIGN_TOKENS.theme.dark.ink.primary,
            DESIGN_TOKENS.layout.padBase,
            DESIGN_TOKENS.theme.light.radius.lg,
            'overflow-x-auto'
          )}>
            <h4 className={combineTokens(
              DESIGN_TOKENS.typography.heading.h5,
              DESIGN_TOKENS.theme.dark.ink.primary,
              DESIGN_TOKENS.spacing.workspace.subtitleMargin
            )}>
              Basic Usage
            </h4>
            <pre className={DESIGN_TOKENS.typography.inline.textSm}>
              <code>{`<Attachment
  title="Document.pdf"
  type="document"
  status="complete"
  metadata={{
    fileSize: 2048000,
    uploadedAt: new Date(),
    uploadedBy: "John Doe"
  }}
  onPreview={() => handlePreview()}
  onDownload={() => handleDownload()}
/>`}</code>
            </pre>
          </div>

          <div className={combineTokens(
            DESIGN_TOKENS.theme.dark.surface.base,
            DESIGN_TOKENS.theme.dark.ink.primary,
            DESIGN_TOKENS.layout.padBase,
            DESIGN_TOKENS.theme.light.radius.lg,
            'overflow-x-auto'
          )}>
            <h4 className={combineTokens(
              DESIGN_TOKENS.typography.heading.h5,
              DESIGN_TOKENS.theme.dark.ink.primary,
              DESIGN_TOKENS.spacing.workspace.subtitleMargin
            )}>
              Upload Progress
            </h4>
            <pre className={DESIGN_TOKENS.typography.inline.textSm}>
              <code>{`<Attachment
  title="Uploading File.pdf"
  type="document"
  status="uploading"
  progress={75}
  metadata={{
    fileSize: 3145728,
    uploadedBy: "Current User"
  }}
/>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentDemo;
