import React from 'react';

interface BankLogoProps {
  bankName: string;
  className?: string;
  size?: number;
}

export const BankLogo: React.FC<BankLogoProps> = ({ bankName, className = '', size = 28 }) => {
  const name = (bankName || '').toUpperCase();

  // State Bank of India (SBI) - Blue background with white circular keyhole
  if (name.includes('SBI') || name.includes('STATE BANK')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#0080c8' }}
        title="State Bank of India (SBI)"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="white">
          <circle cx="16" cy="16" r="14" fill="#0080c8" />
          <path d="M16 6 A10 10 0 1 0 16 26 A10 10 0 1 0 16 6 Z M16 11 A5 5 0 0 1 16 21 A5 5 0 0 1 16 11 Z" fill="white" />
          <rect x="14.5" y="16" width="3" height="10" fill="#0080c8" />
        </svg>
      </div>
    );
  }

  // HDFC Bank - Deep Blue square with red & blue square pattern
  if (name.includes('HDFC')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#004c8f' }}
        title="HDFC Bank"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="none">
          <rect width="32" height="32" rx="4" fill="#004c8f" />
          <rect x="5" y="5" width="22" height="22" stroke="white" strokeWidth="2.5" />
          <rect x="13.5" y="8" width="5" height="16" fill="#ed232a" />
          <rect x="8" y="13.5" width="16" height="5" fill="#ed232a" />
          <rect x="13.5" y="13.5" width="5" height="5" fill="#004c8f" />
        </svg>
      </div>
    );
  }

  // ICICI Bank - Vermilion/Orange rounded square with white arch / 'i'
  if (name.includes('ICICI')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#e05024' }}
        title="ICICI Bank"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="white">
          <rect width="32" height="32" rx="6" fill="#e05024" />
          <circle cx="16" cy="11" r="2.8" fill="white" />
          <path d="M12 16 H20 V19 H18 V24 H14 V16 Z" fill="white" />
          <path d="M22 13 C25 16 25 21 21 25" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  // Canara Bank - Cyan / Yellow interlocking triangles
  if (name.includes('CANARA') || name.includes('CAN')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#0085ca' }}
        title="Canara Bank"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6">
          <rect width="32" height="32" rx="6" fill="#0085ca" />
          <polygon points="16,6 26,24 6,24" fill="none" stroke="#fed100" strokeWidth="3" />
          <polygon points="16,26 6,8 26,8" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        </svg>
      </div>
    );
  }

  // Axis Bank - Burgundy/Maroon rounded square with white stylized 'A'
  if (name.includes('AXIS')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#861f41' }}
        title="Axis Bank"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="white">
          <rect width="32" height="32" rx="6" fill="#861f41" />
          <path d="M16 6 L26 26 H19 L16 19 L13 26 H6 Z" fill="white" />
          <polygon points="16,13 18,18 14,18" fill="#861f41" />
        </svg>
      </div>
    );
  }

  // Indian Bank - Royal blue and teal concentric design
  if (name.includes('INDIAN BANK') || name.includes('IOB')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#0b62a4' }}
        title="Indian Bank"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="white">
          <rect width="32" height="32" rx="6" fill="#0b62a4" />
          <circle cx="16" cy="16" r="10" stroke="#00a887" strokeWidth="2.5" fill="none" />
          <circle cx="16" cy="16" r="5" fill="#f8a51d" />
        </svg>
      </div>
    );
  }

  // Bank of Baroda - Orange rounded with double-B / sun
  if (name.includes('BARODA') || name.includes('BOB')) {
    return (
      <div 
        className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size, backgroundColor: '#f26522' }}
        title="Bank of Baroda"
      >
        <svg viewBox="0 0 32 32" className="w-5/6 h-5/6" fill="white">
          <rect width="32" height="32" rx="6" fill="#f26522" />
          <circle cx="16" cy="16" r="8" fill="white" />
          <circle cx="16" cy="16" r="4.5" fill="#f26522" />
          <path d="M16 4 V9 M16 23 V28 M4 16 H9 M23 16 H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm bg-slate-800 text-cyan-300 font-tech font-bold text-xs ${className}`}
      style={{ width: size, height: size }}
    >
      ATM
    </div>
  );
};
