export default function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f766e" />
      <path d="M20 18h8v11h8V18h8v28h-8V36h-8v10h-8z" fill="#fff" />
    </svg>
  )
}
