import React, { useEffect, useState, createContext, useContext } from 'react';

interface AriaLiveProps {
  message: string;
  level?: 'polite' | 'assertive';
  clearDelay?: number;
}

export function AriaLive({ message, level = 'polite', clearDelay = 3000 }: AriaLiveProps) {
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      
      const timer = setTimeout(() => {
        setDisplayMessage('');
      }, clearDelay);

      return () => clearTimeout(timer);
    }
  }, [message, clearDelay]);

  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {displayMessage}
    </div>
  );
}

interface AriaLiveContextValue {
  announce: (message: string, level?: 'polite' | 'assertive') => void;
}

const AriaLiveContext = createContext<AriaLiveContextValue | null>(null);

export function AriaLiveProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<{ id: string; message: string; level: 'polite' | 'assertive' }[]>([]);

  const announce = (message: string, level: 'polite' | 'assertive' = 'polite') => {
    const id = Date.now().toString();
    setAnnouncements(prev => [...prev, { id, message, level }]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 3000);
  };

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      {children}
      {announcements.map(({ id, message, level }) => (
        <AriaLive key={id} message={message} level={level} />
      ))}
    </AriaLiveContext.Provider>
  );
}

export function useAriaLive() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error('useAriaLive must be used within AriaLiveProvider');
  }
  return context;
}
