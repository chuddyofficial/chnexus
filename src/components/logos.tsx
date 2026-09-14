export function NexusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nexus-stroke" x1="0" y1="0" x2="96" y2="96">
          <stop offset="0%" stopColor="#4d7fff" />
          <stop offset="100%" stopColor="#7c5cff" />
        </linearGradient>
        <filter id="nexus-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M48 4 L86 25 V71 L48 92 L10 71 V25 Z"
        stroke="url(#nexus-stroke)"
        strokeWidth="4"
        filter="url(#nexus-glow)"
      />
      <g stroke="url(#nexus-stroke)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="48" y1="38" x2="34" y2="58" />
        <line x1="48" y1="38" x2="62" y2="58" />
      </g>
      <circle cx="48" cy="38" r="6" fill="#0d1120" stroke="url(#nexus-stroke)" strokeWidth="3" />
      <circle cx="34" cy="58" r="6" fill="#0d1120" stroke="url(#nexus-stroke)" strokeWidth="3" />
      <circle cx="62" cy="58" r="6" fill="#0d1120" stroke="url(#nexus-stroke)" strokeWidth="3" />
    </svg>
  );
}

export function MabuMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mabu-stroke" x1="0" y1="0" x2="96" y2="96">
          <stop offset="0%" stopColor="#35d9d9" />
          <stop offset="100%" stopColor="#4d7fff" />
        </linearGradient>
        <filter id="mabu-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M48 6 L82 18 V46 C82 68 68 84 48 92 C28 84 14 68 14 46 V18 Z"
        stroke="url(#mabu-stroke)"
        strokeWidth="4"
        filter="url(#mabu-glow)"
      />
      <g stroke="url(#mabu-stroke)" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <line x1="48" y1="34" x2="48" y2="50" />
        <line x1="48" y1="50" x2="36" y2="60" />
        <line x1="48" y1="50" x2="60" y2="60" />
      </g>
      <circle cx="48" cy="34" r="4.5" fill="#0d1120" stroke="url(#mabu-stroke)" strokeWidth="2.5" />
      <circle cx="36" cy="60" r="3.5" fill="#0d1120" stroke="url(#mabu-stroke)" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="3.5" fill="#0d1120" stroke="url(#mabu-stroke)" strokeWidth="2.5" />
    </svg>
  );
}
