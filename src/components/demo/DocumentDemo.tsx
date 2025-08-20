/**
 * Document Demo Component
 * 
 * Comprehensive demonstration of the Document component showcasing
 * all variants, formats, and enterprise features.
 */

import React, { useState } from 'react';
import Document from '@/components/ui/Document';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import type { DocumentFormat, DocumentStatus, DocumentSize } from '@/components/ui/Document';

const DocumentDemo: React.FC = () => {
  // Sample documents data
  const sampleDocuments = [
    {
      title: 'Q4 Financial Report 2024',
      format: 'pdf' as DocumentFormat,
      status: 'final' as DocumentStatus,
      fileSize: 2048576, // 2MB
      metadata: {
        author: 'Finance Team',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        modifiedAt: new Date('2024-01-20T15:30:00Z'),
        version: '2.1.0',
        tags: ['financial', 'quarterly', 'board-review'],
        description: 'Comprehensive financial analysis for Q4 2024 including revenue, expenses, and forecasting.',
        pageCount: 45,
        isConfidential: true
      }
    },
    {
      title: 'Project Proposal - Digital Transformation',
      format: 'docx' as DocumentFormat,
      status: 'review' as DocumentStatus,
      fileSize: 1536000, // 1.5MB
      metadata: {
        author: 'Sarah Mitchell',
        createdAt: new Date('2024-02-01T09:15:00Z'),
        modifiedAt: new Date('2024-02-05T14:20:00Z'),
        version: '1.4.0',
        tags: ['proposal', 'strategy', 'digital'],
        description: 'Strategic proposal for company-wide digital transformation initiative.',
        pageCount: 28
      }
    },
    {
      title: 'Sales Data Analysis',
      format: 'xlsx' as DocumentFormat,
      status: 'approved' as DocumentStatus,
      fileSize: 512000, // 512KB
      metadata: {
        author: 'Data Analytics',
        createdAt: new Date('2024-01-28T11:30:00Z'),
        modifiedAt: new Date('2024-02-02T16:45:00Z'),
        version: '3.0.0',
        tags: ['analytics', 'sales', 'q1-data'],
        description: 'Detailed sales performance analysis with trends and predictions.',
        pageCount: 1
      }
    },
    {
      title: 'Company Presentation Template',
      format: 'pptx' as DocumentFormat,
      status: 'draft' as DocumentStatus,
      fileSize: 3145728, // 3MB
      metadata: {
        author: 'Design Team',
        createdAt: new Date('2024-02-10T08:00:00Z'),
        modifiedAt: new Date('2024-02-10T17:30:00Z'),
        version: '1.0.0',
        tags: ['template', 'presentation', 'branding'],
        description: 'Official company presentation template with updated branding guidelines.',
        pageCount: 24
      }
    },
    {
      title: 'Archive - Old Policies.zip',
      format: 'archive' as DocumentFormat,
      status: 'archived' as DocumentStatus,
      fileSize: 10485760, // 10MB
      metadata: {
        author: 'HR Department',
        createdAt: new Date('2023-12-01T00:00:00Z'),
        modifiedAt: new Date('2023-12-15T12:00:00Z'),
        version: '1.0.0',
        tags: ['archived', 'policies', 'legacy'],
        description: 'Archived collection of previous company policies and procedures.',
        expiresAt: new Date('2023-12-31T23:59:59Z')
      }
    }
  ];

  const [showActions, setShowActions] = useState(true);
  const [selectedSize, setSelectedSize] = useState<DocumentSize>('default');

  const handlePreview = (title: string) => {
    // Handle preview action
    alert(`Preview: ${title}`);
  };

  const handleDownload = (title: string) => {
    // Handle download action  
    alert(`Download: ${title}`);
  };

  const handleShare = (title: string) => {
    // Handle share action
    alert(`Share: ${title}`);
  };

  const handleDocumentClick = (title: string) => {
    // Handle document click
    alert(`Open: ${title}`);
  };

  return (
    <div className={combineTokens(
      DESIGN_TOKENS.spacing.sectionLarge,
      'max-w-6xl mx-auto'
    )}>
      {/* Header */}
      <div className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h1 className={DESIGN_TOKENS.typography.heading.h1}>
          Document Component Demo
        </h1>
        <p className={combineTokens(
          DESIGN_TOKENS.typography.body.primary,
          DESIGN_TOKENS.spacing.tightMargin
        )}>
          Enterprise-grade document display component with comprehensive format support and professional features.
        </p>
      </div>

      {/* Controls */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Demo Controls
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Size Control */}
          <div>
            <label className={combineTokens(
              DESIGN_TOKENS.typography.body.small,
              'block mb-2 font-medium'
            )}>
              Size Variant:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as DocumentSize)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="compact">Compact</option>
              <option value="default">Default</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          {/* Actions Control */}
          <div>
            <label className={combineTokens(
              DESIGN_TOKENS.typography.body.small,
              'block mb-2 font-medium'
            )}>
              Show Actions:
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showActions}
                onChange={(e) => setShowActions(e.target.checked)}
                className="mr-2"
              />
              <span className={DESIGN_TOKENS.typography.body.small}>
                Enable action buttons
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Format Examples */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Document Format Examples
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleDocuments.map((doc, index) => (
            <Document
              key={index}
              title={doc.title}
              format={doc.format}
              status={doc.status}
              size={selectedSize}
              fileSize={doc.fileSize}
              metadata={doc.metadata}
              showPreview={showActions}
              showDownload={showActions}
              showShare={showActions}
              onClick={() => handleDocumentClick(doc.title)}
              onPreview={() => handlePreview(doc.title)}
              onDownload={() => handleDownload(doc.title)}
              onShare={() => handleShare(doc.title)}
            />
          ))}
        </div>
      </section>

      {/* Status Variants */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Document Status Indicators
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(['draft', 'review', 'approved', 'final', 'archived'] as DocumentStatus[]).map((status) => (
            <Document
              key={status}
              title={`${status.charAt(0).toUpperCase() + status.slice(1)} Document`}
              format="pdf"
              status={status}
              size="compact"
              fileSize={1024000}
              showPreview={false}
              showDownload={false}
              showShare={false}
            />
          ))}
        </div>
      </section>

      {/* Interactive Features */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Interactive Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* External Document */}
          <Document
            title="External Research Report"
            format="pdf"
            status="final"
            size="default"
            fileSize={5242880}
            isExternal={true}
            metadata={{
              author: 'External Consultancy',
              modifiedAt: new Date('2024-02-01T10:00:00Z'),
              description: 'Market research report from external consultancy firm.',
              tags: ['external', 'research', 'market-analysis']
            }}
            showPreview={true}
            showDownload={true}
            showShare={true}
            onPreview={() => handlePreview('External Research Report')}
            onDownload={() => handleDownload('External Research Report')}
            onShare={() => handleShare('External Research Report')}
          />

          {/* Confidential Document */}
          <Document
            title="Strategic Roadmap 2024"
            format="pptx"
            status="final"
            size="default"
            fileSize={4194304}
            metadata={{
              author: 'Executive Team',
              modifiedAt: new Date('2024-01-30T16:00:00Z'),
              description: 'Confidential strategic roadmap and business objectives for 2024.',
              tags: ['strategy', 'roadmap', 'executive'],
              isConfidential: true
            }}
            showPreview={true}
            showDownload={true}
            showShare={false}
            onPreview={() => handlePreview('Strategic Roadmap 2024')}
            onDownload={() => handleDownload('Strategic Roadmap 2024')}
          />

          {/* Loading State */}
          <Document
            title="Loading Document..."
            format="docx"
            status="draft"
            size="default"
            loading={true}
            showPreview={true}
            showDownload={true}
          />

          {/* Disabled State */}
          <Document
            title="Unavailable Document"
            format="xlsx"
            status="archived"
            size="default"
            fileSize={2048000}
            disabled={true}
            metadata={{
              author: 'System',
              modifiedAt: new Date('2023-12-01T00:00:00Z'),
              description: 'This document is currently unavailable due to system maintenance.'
            }}
            showPreview={true}
            showDownload={true}
          />
        </div>
      </section>

      {/* Detailed View Example */}
      {selectedSize === 'detailed' && (
        <section className={DESIGN_TOKENS.spacing.sectionMargin}>
          <h2 className={combineTokens(
            DESIGN_TOKENS.typography.heading.h3,
            DESIGN_TOKENS.spacing.workspace.subtitleMargin
          )}>
            Detailed View with Rich Metadata
          </h2>
          
          <Document
            title="Annual Report 2024 - Complete Analysis"
            format="pdf"
            status="final"
            size="detailed"
            fileSize={15728640} // 15MB
            thumbnailUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjE2OCIgaGVpZ2h0PSI5NiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxMDAiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RG9jdW1lbnQgUHJldmlldz48L3RleHQ+Cjwvc3ZnPgo="
            metadata={{
              author: 'Corporate Team',
              createdAt: new Date('2024-01-01T00:00:00Z'),
              modifiedAt: new Date('2024-02-15T18:00:00Z'),
              version: '3.2.1',
              tags: ['annual-report', 'financial', 'comprehensive', 'board-approved', 'public'],
              description: 'Complete annual report including financial statements, operational highlights, strategic initiatives, and forward-looking guidance for stakeholders and investors.',
              pageCount: 156,
              isConfidential: false
            }}
            showPreview={true}
            showDownload={true}
            showShare={true}
            onClick={() => handleDocumentClick('Annual Report 2024')}
            onPreview={() => handlePreview('Annual Report 2024')}
            onDownload={() => handleDownload('Annual Report 2024')}
            onShare={() => handleShare('Annual Report 2024')}
          />
        </section>
      )}

      {/* File Type Examples */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Supported File Formats
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { format: 'pdf' as DocumentFormat, name: 'PDF Document' },
            { format: 'doc' as DocumentFormat, name: 'Word Doc' },
            { format: 'docx' as DocumentFormat, name: 'Word Document' },
            { format: 'xls' as DocumentFormat, name: 'Excel File' },
            { format: 'xlsx' as DocumentFormat, name: 'Excel Workbook' },
            { format: 'ppt' as DocumentFormat, name: 'PowerPoint' },
            { format: 'pptx' as DocumentFormat, name: 'Presentation' },
            { format: 'csv' as DocumentFormat, name: 'CSV Data' },
            { format: 'txt' as DocumentFormat, name: 'Text File' },
            { format: 'image' as DocumentFormat, name: 'Image File' },
            { format: 'archive' as DocumentFormat, name: 'Archive' },
            { format: 'unknown' as DocumentFormat, name: 'Unknown' }
          ].map(({ format, name }) => (
            <Document
              key={format}
              title={name}
              format={format}
              status="final"
              size="compact"
              fileSize={1024}
              showPreview={false}
              showDownload={false}
              showShare={false}
            />
          ))}
        </div>
      </section>

      {/* Feature Summary */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className={combineTokens(
            DESIGN_TOKENS.typography.heading.h4,
            'text-blue-900 mb-4'
          )}>
            Enterprise Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>11 supported file formats</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>5 document status indicators</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>3 size variants (compact, default, detailed)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>Rich metadata support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>Interactive action buttons</span>
              </li>
            </ul>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>WCAG 2.1 AA accessibility</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>Keyboard navigation support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>Loading and disabled states</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>Thumbnail preview support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className={DESIGN_TOKENS.typography.body.small}>100% DESIGN_TOKENS compliant</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentDemo;
