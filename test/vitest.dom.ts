/**
 * @fileoverview Vitest DOM Setup - Enterprise Browser Environment
 *
 * @description DOM mocking and browser API setup for enterprise-grade component testing
 * with enhanced accessibility and performance monitoring capabilities.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// ===== REACT TESTING LIBRARY CLEANUP =====

afterEach(() => {
  cleanup();
});

// ===== BROWSER API MOCKS =====

/**
 * Enhanced matchMedia mock with detailed media query support
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * ResizeObserver mock for component layout testing
 */
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/**
 * IntersectionObserver mock for visibility testing
 */
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

/**
 * Enhanced localStorage mock with event dispatching
 */
const createEnhancedLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
      window.dispatchEvent(
        new StorageEvent('storage', { key, newValue: value })
      );
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
      window.dispatchEvent(
        new StorageEvent('storage', { key, newValue: null })
      );
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
      window.dispatchEvent(new StorageEvent('storage', { key: null }));
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: createEnhancedLocalStorage(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: createEnhancedLocalStorage(),
});

/**
 * Window.location mock for navigation testing
 */
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

/**
 * Clipboard API mock for copy/paste functionality
 * Made configurable to work with testing libraries
 */
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      readText: vi.fn().mockResolvedValue(''),
      writeText: vi.fn().mockResolvedValue(undefined),
      read: vi.fn().mockResolvedValue([]),
      write: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
    configurable: true,
  });
}

/**
 * Enhanced scrollIntoView mock with behavior options
 */
Element.prototype.scrollIntoView = vi.fn().mockImplementation(function (
  this: Element,
  options?: ScrollIntoViewOptions | boolean
) {
  // Mock implementation that tracks calls for testing
  const element = this;
  if (typeof options === 'object' && options) {
    // Handle ScrollIntoViewOptions
    console.debug(
      `scrollIntoView called on ${element.tagName} with options:`,
      options
    );
  } else {
    // Handle boolean or no options
    console.debug(
      `scrollIntoView called on ${element.tagName} with alignToTop:`,
      options
    );
  }
});

/**
 * Focus management mocks
 */
HTMLElement.prototype.focus = vi.fn();
HTMLElement.prototype.blur = vi.fn();

/**
 * getComputedStyle mock for CSS property queries
 */
global.getComputedStyle = vi.fn().mockImplementation((_element: Element) => ({
  getPropertyValue: vi.fn().mockReturnValue(''),
  pointerEvents: 'auto',
  visibility: 'visible',
  display: 'block',
  opacity: '1',
  // Add common CSS properties
  position: 'static',
  zIndex: 'auto',
  overflow: 'visible',
}));

/**
 * Form validation API mocks
 */
HTMLInputElement.prototype.setCustomValidity = vi.fn();
HTMLInputElement.prototype.checkValidity = vi.fn().mockReturnValue(true);
HTMLInputElement.prototype.reportValidity = vi.fn().mockReturnValue(true);

/**
 * Dialog element mock for modal testing
 */
if (!window.HTMLDialogElement) {
  window.HTMLDialogElement = class HTMLDialogElement extends HTMLElement {
    open = false;
    returnValue = '';

    show = vi.fn(() => {
      this.open = true;
    });
    showModal = vi.fn(() => {
      this.open = true;
    });
    close = vi.fn((returnValue?: string) => {
      this.open = false;
      if (returnValue !== undefined) this.returnValue = returnValue;
    });
  } as any;
}

/**
 * CSS getComputedStyle mock
 */
window.getComputedStyle = vi.fn().mockImplementation(() => ({
  getPropertyValue: vi.fn().mockReturnValue(''),
  setProperty: vi.fn(),
  removeProperty: vi.fn(),
}));

/**
 * Animation API mocks
 */
Element.prototype.animate = vi.fn().mockImplementation(() => ({
  finished: Promise.resolve(),
  cancel: vi.fn(),
  finish: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  reverse: vi.fn(),
  updatePlaybackRate: vi.fn(),
}));

/**
 * Web Animations API mocks
 */
global.Animation = vi.fn().mockImplementation(() => ({
  finished: Promise.resolve(),
  ready: Promise.resolve(),
  cancel: vi.fn(),
  finish: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  reverse: vi.fn(),
})) as any;

/**
 * Performance API mocks
 */
Object.defineProperty(window, 'performance', {
  value: {
    ...window.performance,
    now: vi.fn().mockImplementation(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    getEntriesByName: vi.fn().mockReturnValue([]),
    getEntriesByType: vi.fn().mockReturnValue([]),
  },
  writable: true,
});

// Also set global performance
Object.defineProperty(global, 'performance', {
  value: window.performance,
  writable: true,
});

/**
 * RequestIdleCallback mock for performance optimization testing
 */
global.requestIdleCallback = vi
  .fn()
  .mockImplementation((callback: IdleRequestCallback) => {
    const id = setTimeout(
      () =>
        callback({
          didTimeout: false,
          timeRemaining: () => 50,
        }),
      0
    );
    return id as any;
  });

global.cancelIdleCallback = vi.fn().mockImplementation((id: number) => {
  clearTimeout(id);
});

/**
 * Pointer events mocks
 */
global.PointerEvent = class PointerEvent extends MouseEvent {
  pointerId = 1;
  width = 1;
  height = 1;
  pressure = 0;
  tangentialPressure = 0;
  tiltX = 0;
  tiltY = 0;
  twist = 0;
  pointerType = 'mouse';
  isPrimary = true;

  constructor(type: string, eventInitDict?: PointerEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      // Safely assign only writable properties
      const writableProps: (keyof PointerEventInit)[] = [
        'pointerId',
        'width',
        'height',
        'pressure',
        'tangentialPressure',
        'tiltX',
        'tiltY',
        'twist',
        'pointerType',
        'isPrimary',
      ];

      writableProps.forEach(prop => {
        if (prop in eventInitDict && eventInitDict[prop] !== undefined) {
          try {
            (this as any)[prop] = eventInitDict[prop];
          } catch {
            // Ignore read-only properties
          }
        }
      });
    }
  }
} as any;

/**
 * Touch events mocks
 */
global.TouchEvent = class TouchEvent extends UIEvent {
  touches: Touch[] = [];
  targetTouches: Touch[] = [];
  changedTouches: Touch[] = [];
  altKey = false;
  metaKey = false;
  ctrlKey = false;
  shiftKey = false;

  constructor(type: string, eventInitDict?: TouchEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      Object.assign(this, eventInitDict);
    }
  }
} as any;

console.info(
  '🌐 Vitest DOM environment configured with enterprise browser API mocks'
);
