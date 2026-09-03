export default function QtyStepper({ value, onChange, min = 0, max = 999, label = 'cartons', size = 'md' }) {
  const h = size === 'lg' ? 'h-12' : 'h-11'
  const clamp = (n) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : min))
  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-full border border-line-2 bg-surface`} role="group" aria-label={`Quantity in ${label}`}>
      <button
        type="button"
        className="w-11 text-lg text-ink-2 transition-colors hover:bg-stage hover:text-ink disabled:opacity-30"
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
        className="num w-12 border-x border-line bg-transparent text-center text-[15px] font-semibold text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label={`Quantity in ${label}`}
      />
      <button
        type="button"
        className="w-11 text-lg text-ink-2 transition-colors hover:bg-stage hover:text-ink disabled:opacity-30"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
