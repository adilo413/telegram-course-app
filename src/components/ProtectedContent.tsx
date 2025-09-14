'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ProtectedContentProps {
  children: ReactNode;
  userId?: string | number;
  watermarkText?: string;
  className?: string;
}

export default function ProtectedContent({
  children,
  userId,
  watermarkText,
  className = '',
}: ProtectedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P, F12, etc.
      if (e.ctrlKey || e.metaKey) {
        if (['c', 'a', 's', 'p', 'u', 'i', 'j'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }
      
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent image saving
    const handleDragEnd = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent print
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('beforeprint', handleBeforePrint);

    // Disable text selection via CSS
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    bodyStyle.mozUserSelect = 'none';
    bodyStyle.msUserSelect = 'none';

    // Clean up
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('beforeprint', handleBeforePrint);
      
      // Re-enable text selection
      const bodyStyle = document.body.style as any;
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      bodyStyle.mozUserSelect = '';
      bodyStyle.msUserSelect = '';
    };
  }, []);

  // Generate watermark text
  const getWatermarkText = () => {
    if (watermarkText) return watermarkText;
    return userId ? `User: ${userId}` : 'Protected Content';
  };

  return (
    <div className={`relative ${className}`} ref={contentRef}>
      {/* Watermark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' fill='%23e5e7eb' transform='rotate(-30, 200 200)'%3E${encodeURIComponent(getWatermarkText())}%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.1,
          zIndex: 1,
        }}
      />
      
      {/* Content */}
      <div 
        className="relative z-20"
        style={{
          // Additional protection styles
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        {children}
      </div>
      
      {/* Additional overlay to prevent right-click on images */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Disable image saving */}
      <style jsx global>{`
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
        
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
