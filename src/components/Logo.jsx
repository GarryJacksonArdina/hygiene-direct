// Wordmark. Serif, with the second word in italic and a single green point.
export default function Logo({ className = '', light = false }) {
  return (
    <span className={`inline-flex items-baseline font-display text-[22px] font-medium leading-none tracking-[-0.01em] ${light ? 'text-paper' : 'text-ink'} ${className}`}>
      Hygiene<span className="ml-1 italic">Direct</span>
      <span className={`ml-0.5 inline-block h-[5px] w-[5px] rounded-full ${light ? 'bg-paper' : 'bg-brand'}`} aria-hidden="true" />
    </span>
  )
}
