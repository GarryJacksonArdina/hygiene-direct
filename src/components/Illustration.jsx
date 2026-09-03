// Simple flat illustrations so the site works before product photography exists.
// Swap for <img> tags once real photos are available (see README).
export default function Illustration({ kind, className = '' }) {
  if (kind === 'roll') return <Roll className={className} />
  if (kind === 'towel') return <Towel className={className} />
  if (kind === 'soap') return <Soap className={className} />
  return null
}

function Roll({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rollShade" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="140" rx="70" ry="10" fill="#0f172a" opacity="0.08" />
      <rect x="45" y="40" width="110" height="90" rx="4" fill="url(#rollShade)" stroke="#cbd5e1" strokeWidth="2" />
      <ellipse cx="100" cy="40" rx="55" ry="18" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <ellipse cx="100" cy="40" rx="18" ry="6" fill="#94a3b8" />
      <ellipse cx="100" cy="40" rx="14" ry="4.5" fill="#64748b" />
      <path d="M155 80 q30 10 25 45 q-10 -20 -25 -20z" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M50 110 h100" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 6" />
    </svg>
  )
}

function Towel({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <ellipse cx="100" cy="142" rx="72" ry="9" fill="#0f172a" opacity="0.08" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(0 ${110 - i * 13})`}>
          <path d="M40 20 L100 5 L160 20 L100 35 Z" fill={i % 2 ? '#f1f5f9' : '#ffffff'} stroke="#cbd5e1" strokeWidth="1.5" />
        </g>
      ))}
      <path d="M100 30 L160 45 L160 58 L100 43 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M40 45 L100 30 L100 43 L40 58 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M100 43 L100 130" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  )
}

function Soap({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <ellipse cx="100" cy="146" rx="60" ry="8" fill="#0f172a" opacity="0.08" />
      <rect x="60" y="45" width="80" height="100" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="60" y="80" width="80" height="65" rx="12" fill="#ccfbf1" opacity="0.9" />
      <rect x="66" y="92" width="68" height="34" rx="6" fill="#0f766e" />
      <text x="100" y="114" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">SOAP</text>
      <rect x="85" y="25" width="30" height="24" rx="4" fill="#115e59" />
      <rect x="95" y="10" width="10" height="18" rx="3" fill="#0f766e" />
      <path d="M100 12 h22 a6 6 0 0 1 6 6 v6" fill="none" stroke="#0f766e" strokeWidth="8" strokeLinecap="round" />
      <circle cx="132" cy="34" r="4" fill="#99f6e4" />
    </svg>
  )
}
