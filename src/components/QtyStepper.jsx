export default function QtyStepper({ value, onChange, min = 0, max = 999, size = 'md', label = 'cartons' }) {
  const h = size === 'lg' ? 'h-12' : 'h-10'
  const clamp = (n) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : min))
  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-xl border border-ink-300 bg-white`} role="group" aria-label={`Quantity in ${label}`}>
      <button
        type="button"
        className="w-11 text-xl font-semibold text-ink-700 hover:bg-ink-100 active:bg-ink-300/50 disabled:opacity-40"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value || '0', 10)))}
        onFocus={(e) => e.target.select()}
        className="w-14 border-x border-ink-300 text-center text-base font-bold text-ink-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label={`Quantity in ${label}`}
      />
      <button
        type="button"
        className="w-11 text-xl font-semibold text-ink-700 hover:bg-ink-100 active:bg-ink-300/50 disabled:opacity-40"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
