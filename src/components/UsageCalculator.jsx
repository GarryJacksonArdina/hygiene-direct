import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cartonPrice, fmt } from '../lib/pricing'
import { estimateMonthly } from '../lib/usage'

export default function UsageCalculator() {
  const [staff, setStaff] = useState(20)
  const [visitors, setVisitors] = useState(0)
  const [months, setMonths] = useState(1)
  const { replace } = useCart()
  const navigate = useNavigate()

  const rows = useMemo(() => estimateMonthly({ staff, visitors }), [staff, visitors])
  const lines = rows.map((r) => ({ ...r, cartons: Math.max(1, Math.ceil(r.raw * months)) }))
  const total = lines.reduce((s, l) => s + cartonPrice(l.variant, l.cartons) * l.cartons, 0)

  function useSuggestion() {
    replace(lines.map((l) => ({ productId: l.product.id, variantId: l.variant.id, qty: l.cartons })))
    navigate('/order')
  }

  return (
    <div className="mx-auto grid max-w-[1024px] gap-10 md:grid-cols-2 md:items-center">
      <div>
        <p className="eyebrow !text-white/50">Calculator</p>
        <h3 className="display mt-3 text-[40px] leading-[1.05] text-white md:text-[48px]">How much do you need?</h3>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/60">
          Tell us who uses your washrooms and we will suggest a starting order. Adjust anything before you submit.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Field label="Staff on site" value={staff} onChange={setStaff} />
          <Field label="Visitors per day" value={visitors} onChange={setVisitors} />
        </div>
        <div className="mt-5 inline-flex rounded-full bg-white/10 p-1">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              className={`num rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${months === m ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`}
            >
              {m} month{m > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-7 text-ink sm:p-9">
        <p className="eyebrow">Suggested order</p>
        <ul className="mt-3 divide-y divide-line/70">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-[15px] font-medium">{l.product.shortName}</p>
                <p className="text-[12px] text-ink-3">{l.variant.shortLabel ?? l.variant.label}</p>
              </div>
              <div className="text-right">
                <p className="num text-[15px] font-medium">{l.cartons} carton{l.cartons === 1 ? '' : 's'}</p>
                <p className="num text-[12px] text-ink-3">{fmt(cartonPrice(l.variant, l.cartons) * l.cartons)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-line/70 pt-4">
          <span className="text-[13px] text-ink-2">Estimated total, ex GST</span>
          <span className="num display text-[30px] leading-none">{fmt(total)}</span>
        </div>
        <button type="button" className="btn-primary mt-6 w-full" onClick={useSuggestion}>
          Use this as my order
        </button>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
          Estimate only, based on 22 working days a month and typical office use. Cartons round up so you do not run short.
        </p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl bg-white/10 px-4 py-3">
      <span className="block text-[12px] text-white/60">{label}</span>
      <input
        type="number"
        min="0"
        max="5000"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || '0', 10)))}
        onFocus={(e) => e.target.select()}
        className="num mt-0.5 w-full bg-transparent text-[26px] font-semibold text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
    </label>
  )
}
