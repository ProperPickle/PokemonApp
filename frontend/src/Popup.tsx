import { useEffect, useRef } from 'react';
import './Popup.css'

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Popup({ isOpen, onClose, children }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div 
        ref={popupRef}
        style={{backgroundColor: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)", maxWidth: "28rem", width: "100%", margin: "0 1rem", maxHeight: "80vh", overflow: "auto"}}
      >
        {children}
        <button 
          onClick={onClose}
          style={{marginTop: "1rem", width: "100%", backgroundColor: "#e2e8f0", padding: "0.5rem", borderRadius: "0.25rem", cursor: "pointer", border: "none"}}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Popup;   