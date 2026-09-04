export default function Logo({ className = '', light = false }) {
  return (
    <span className={`font-display text-[19px] font-semibold leading-none tracking-[-0.03em] ${light ? 'text-white' : 'text-ink'} ${className}`}>
      Hygiene Direct
    </span>
  )
}
