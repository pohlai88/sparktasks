import React from 'react';
import Tooltip from '../ui/Tooltip';

/**
 * TooltipDemo: Demonstrates enterprise-grade Tooltip capabilities
 * - Multi-trigger support
 * - Custom positioning and delays
 * - Controlled state management
 * - Complex content support
 * - Full accessibility compliance
 */
export const TooltipDemo: React.FC = () => {
  const [controlledOpen, setControlledOpen] = React.useState(false);

  const complexContent = (
    <div style={{ maxWidth: '300px' }}>
      <h4 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
        Rich Tooltip Content
      </h4>
      <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
        This tooltip can contain complex React content including:
      </p>
      <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '14px' }}>
        <li>
          Formatted text with <strong>bold</strong> and <em>italic</em>
        </li>
        <li>Lists and structured content</li>
        <li>Custom styling and layouts</li>
      </ul>
    </div>
  );

  return (
    <div
      style={{
        padding: '64px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
        minHeight: '400px',
      }}
    >
      {/* Basic Hover Tooltip */}
      <div style={{ textAlign: 'center' }}>
        <h3>Basic Hover</h3>
        <Tooltip content='This is a basic hover tooltip with default settings'>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Hover Me
          </button>
        </Tooltip>
      </div>

      {/* Focus Trigger */}
      <div style={{ textAlign: 'center' }}>
        <h3>Focus Trigger</h3>
        <Tooltip
          content='Accessible tooltip shown on focus for keyboard users'
          trigger='focus'
        >
          <input
            type='text'
            placeholder='Focus me with Tab'
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        </Tooltip>
      </div>

      {/* Click Trigger */}
      <div style={{ textAlign: 'center' }}>
        <h3>Click Trigger</h3>
        <Tooltip content='Click tooltip - toggle visibility' trigger='click'>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Click to Toggle
          </button>
        </Tooltip>
      </div>

      {/* Multiple Triggers */}
      <div style={{ textAlign: 'center' }}>
        <h3>Multi-Trigger</h3>
        <Tooltip
          content='Responds to both hover and focus events'
          trigger={['hover', 'focus']}
        >
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Hover or Focus
          </button>
        </Tooltip>
      </div>

      {/* Bottom Position */}
      <div style={{ textAlign: 'center' }}>
        <h3>Bottom Position</h3>
        <Tooltip
          content='Tooltip positioned below the trigger'
          position='bottom'
        >
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Bottom Tooltip
          </button>
        </Tooltip>
      </div>

      {/* Custom Delays */}
      <div style={{ textAlign: 'center' }}>
        <h3>Custom Delays</h3>
        <Tooltip
          content='Slow to show (1s), quick to hide'
          delayShow={1000}
          delayHide={0}
        >
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delayed Show
          </button>
        </Tooltip>
      </div>

      {/* Controlled State */}
      <div style={{ textAlign: 'center' }}>
        <h3>Controlled State</h3>
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => setControlledOpen(!controlledOpen)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {controlledOpen ? 'Hide' : 'Show'} Tooltip
          </button>
        </div>
        <Tooltip
          content='This tooltip is controlled programmatically'
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          trigger='manual'
        >
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '4px',
            }}
          >
            Controlled Target
          </div>
        </Tooltip>
      </div>

      {/* Complex Content */}
      <div style={{ textAlign: 'center' }}>
        <h3>Rich Content</h3>
        <Tooltip content={complexContent} position='left'>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Rich Tooltip
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default TooltipDemo;
