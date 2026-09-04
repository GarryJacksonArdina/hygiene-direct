// Product visuals. If a product has an `image` path it is used as a photo.
// Otherwise a soft tonal render stands in until photography exists.
export default function Illustration({ kind, image, alt = '', className = '' }) {
  if (image) return <img src={image} alt={alt} className={`${className} object-contain`} loading="lazy" />
  if (kind === 'roll') return <Roll className={className} />
  if (kind === 'towel') return <Towel className={className} />
  if (kind === 'soap') return <Soap className={className} />
  return null
}

const defs = (
  <defs>
    <linearGradient id="r-body" x1="0" x2="1">
      <stop offset="0" stopColor="#e9e9ee" />
      <stop offset="0.18" stopColor="#ffffff" />
      <stop offset="0.6" stopColor="#f6f6f8" />
      <stop offset="1" stopColor="#d5d5db" />
    </linearGradient>
    <linearGradient id="r-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#e4e4e9" />
    </linearGradient>
    <linearGradient id="r-dark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#3a3a3f" />
      <stop offset="1" stopColor="#1d1d1f" />
    </linearGradient>
    <radialGradient id="r-shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#000" stopOpacity="0.18" />
      <stop offset="0.7" stopColor="#000" stopOpacity="0.04" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
  </defs>
)

function Roll({ className }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="206" rx="92" ry="14" fill="url(#r-shadow)" />
      <path d="M52 78 v104 a68 22 0 0 0 136 0 v-104 z" fill="url(#r-body)" />
      <ellipse cx="120" cy="78" rx="68" ry="22" fill="url(#r-top)" />
      <ellipse cx="120" cy="78" rx="19" ry="6.5" fill="#cfcfd5" />
      <ellipse cx="120" cy="78" rx="15" ry="5" fill="#a9a9b0" />
      <path d="M52 182 a68 22 0 0 0 136 0" fill="none" stroke="#c9c9cf" strokeWidth="1" />
      <path d="M188 120 c30 8 40 30 32 60 c-9 -18 -20 -25 -32 -27 z" fill="#fff" stroke="#d6d6dc" strokeWidth="1" />
      <path d="M58 100 h124 M58 126 h124 M58 152 h124" stroke="#e6e6ea" strokeWidth="1" strokeDasharray="2 6" />
      <path d="M62 84 v96" stroke="#fff" strokeWidth="6" opacity="0.7" />
    </svg>
  )
}

function Towel({ className }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="204" rx="98" ry="13" fill="url(#r-shadow)" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} transform={`translate(0 ${176 - i * 11})`}>
          <path d="M40 0 L120 -20 L200 0 L120 20 Z" fill={i % 2 ? '#f2f2f5' : '#ffffff'} stroke="#d6d6dc" strokeWidth="1" />
        </g>
      ))}
      <path d="M120 116 L200 96 L200 176 L120 196 Z" fill="#e6e6eb" stroke="#d6d6dc" strokeWidth="1" />
      <path d="M40 96 L120 116 L120 196 L40 176 Z" fill="#f7f7f9" stroke="#d6d6dc" strokeWidth="1" />
      <path d="M124 72 L194 54 L194 62 L124 80 Z" fill="#ffffff" stroke="#d6d6dc" strokeWidth="1" />
    </svg>
  )
}

function Soap({ className }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      {defs}
      <ellipse cx="120" cy="212" rx="66" ry="11" fill="url(#r-shadow)" />
      <rect x="80" y="76" width="80" height="134" rx="14" fill="url(#r-body)" stroke="#d6d6dc" strokeWidth="1" />
      <rect x="80" y="118" width="80" height="92" rx="14" fill="#e3f1ea" opacity="0.85" />
      <rect x="90" y="132" width="60" height="34" rx="4" fill="#fff" stroke="#d6d6dc" strokeWidth="1" />
      <text x="120" y="148" textAnchor="middle" fontSize="7.5" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="1.2" fill="#1d1d1f">HAND SOAP</text>
      <text x="120" y="158" textAnchor="middle" fontSize="6" fontFamily="Inter, sans-serif" fill="#86868b">pH BALANCED · 5 L</text>
      <rect x="102" y="56" width="36" height="22" rx="4" fill="url(#r-dark)" />
      <rect x="113" y="36" width="14" height="22" rx="3" fill="#3a3a3f" />
      <path d="M120 40 h26 a9 9 0 0 1 9 9 v7" fill="none" stroke="#1d1d1f" strokeWidth="10" strokeLinecap="round" />
      <path d="M155 60 v5" stroke="#1d1d1f" strokeWidth="10" strokeLinecap="round" />
      <path d="M88 84 v112" stroke="#fff" strokeWidth="5" opacity="0.8" />
    </svg>
  )
}
