// Restrained tonal illustrations so the catalogue reads well before product
// photography exists. Swap for <img> once photos are shot (see README).
export default function Illustration({ kind, className = '' }) {
  if (kind === 'roll') return <Roll className={className} />
  if (kind === 'towel') return <Towel className={className} />
  if (kind === 'soap') return <Soap className={className} />
  return null
}

const defs = (
  <defs>
    <linearGradient id="il-body" x1="0" x2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.55" stopColor="#f7f7f5" />
      <stop offset="1" stopColor="#dfe1dc" />
    </linearGradient>
    <linearGradient id="il-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#ecedea" />
    </linearGradient>
    <linearGradient id="il-green" x1="0" x2="1">
      <stop offset="0" stopColor="#255c4b" />
      <stop offset="1" stopColor="#1e4b3d" />
    </linearGradient>
    <radialGradient id="il-shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#14201d" stopOpacity="0.16" />
      <stop offset="1" stopColor="#14201d" stopOpacity="0" />
    </radialGradient>
  </defs>
)

function Roll({ className }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="172" rx="86" ry="14" fill="url(#il-shadow)" />
      <path d="M62 62 v88 a58 20 0 0 0 116 0 v-88 z" fill="url(#il-body)" />
      <ellipse cx="120" cy="62" rx="58" ry="20" fill="url(#il-top)" stroke="#d3d6d0" strokeWidth="1" />
      <ellipse cx="120" cy="62" rx="17" ry="6" fill="#c9cdc6" />
      <ellipse cx="120" cy="62" rx="13" ry="4.4" fill="#aeb4ae" />
      <path d="M62 150 a58 20 0 0 0 116 0" fill="none" stroke="#d3d6d0" strokeWidth="1" />
      <path d="M178 98 c26 6 36 24 30 50 c-8 -14 -18 -20 -30 -22 z" fill="#ffffff" stroke="#d3d6d0" strokeWidth="1" />
      <path d="M70 84 h96 M70 106 h96 M70 128 h96" stroke="#e6e8e3" strokeWidth="1" strokeDasharray="3 5" />
    </svg>
  )
}

function Towel({ className }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="170" rx="92" ry="13" fill="url(#il-shadow)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i} transform={`translate(0 ${150 - i * 11})`}>
          <path d="M46 0 L120 -18 L194 0 L120 18 Z" fill={i % 2 ? '#f4f5f2' : '#ffffff'} stroke="#d3d6d0" strokeWidth="1" />
        </g>
      ))}
      <path d="M120 102 L194 84 L194 150 L120 168 Z" fill="#e8eae5" stroke="#d3d6d0" strokeWidth="1" />
      <path d="M46 84 L120 102 L120 168 L46 150 Z" fill="#f7f7f5" stroke="#d3d6d0" strokeWidth="1" />
      <path d="M124 60 L190 44 L190 52 L124 68 Z" fill="#ffffff" stroke="#d3d6d0" strokeWidth="1" />
    </svg>
  )
}

function Soap({ className }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="176" rx="64" ry="11" fill="url(#il-shadow)" />
      <rect x="82" y="58" width="76" height="116" rx="10" fill="url(#il-body)" stroke="#d3d6d0" strokeWidth="1" />
      <rect x="82" y="96" width="76" height="78" rx="10" fill="#e4ece7" opacity="0.9" />
      <rect x="90" y="108" width="60" height="30" rx="2" fill="#ffffff" stroke="#d3d6d0" strokeWidth="1" />
      <text x="120" y="122" textAnchor="middle" fontSize="7.5" fontFamily="Hanken Grotesk, sans-serif" fontWeight="600" letterSpacing="1.2" fill="#1e4b3d">HAND SOAP</text>
      <text x="120" y="132" textAnchor="middle" fontSize="6" fontFamily="Hanken Grotesk, sans-serif" fill="#8c948f">pH BALANCED · 5 L</text>
      <rect x="104" y="40" width="32" height="20" rx="3" fill="url(#il-green)" />
      <rect x="114" y="22" width="12" height="20" rx="3" fill="#255c4b" />
      <path d="M120 26 h24 a8 8 0 0 1 8 8 v6" fill="none" stroke="#1e4b3d" strokeWidth="9" strokeLinecap="round" />
      <path d="M152 44 v4" stroke="#1e4b3d" strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}
