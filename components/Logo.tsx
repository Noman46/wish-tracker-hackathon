export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Star Logo with circle and plus */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Four-pointed star outline */}
        <path
          d="M18 4 L22 12 L30 14 L24 20 L25 28 L18 24 L11 28 L12 20 L6 14 L14 12 Z"
          stroke="#2563EB"
          strokeWidth="2"
          fill="none"
        />
        {/* Small circle at bottom-left point */}
        <circle cx="10" cy="28" r="1.5" fill="#2563EB" />
        {/* Small plus at top-right point */}
        <g transform="translate(28, 6)">
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-2" y1="0" x2="2" y2="0" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
      
      {/* Text Logo */}
      <div className="flex items-baseline">
        <span 
          className="text-2xl text-blue-600 tracking-tight" 
          style={{ 
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 400,
            letterSpacing: '0.02em'
          }}
        >
          WISH
        </span>
        <span 
          className="text-2xl text-blue-600 tracking-tight ml-1" 
          style={{ 
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}
        >
          TRACKER
        </span>
      </div>
    </div>
  );
}

