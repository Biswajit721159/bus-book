import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  minWidth?: number;
  children: React.ReactNode;
}

export const Portal: React.FC<PortalProps> = ({ triggerRef, open, minWidth, children }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const reposition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    
    // Ensure it doesn't overflow right edge of viewport
    const width = minWidth || r.width;
    let left = r.left;
    if (left + width > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - width - 16);
    }

    setStyle({
      position: 'fixed',
      top: r.bottom + 8,
      left: left,
      minWidth: width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(<div style={style}>{children}</div>, document.body);
};

export default Portal;
