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
    <div className="grid overflow-hidden border border-line md:grid-cols-12">
      <div className="bg-brand p-8 text-paper md:col-span-5 md:p-10">
        <p className="eyebrow !text-paper/60">Calculator</p>
        <h3 className="display mt-3 text-[32px] leading-[1.05]">How much do you need?</h3>
        <p className="mt-3 text-[14px] leading-relaxed text-paper/70">
          Tell us roughly who uses your washrooms and we will suggest a starting order. Adjust anything before you submit.
        </p>
        <div className="mt-8 space-y-5">
          <Field label="Staff on site" value={staff} onChange={setStaff} hint="People at work on a normal day" />
          <Field label="Visitors per day" value={visitors} onChange={setVisitors} hint="Customers, students, patients, contractors" />
          <div>
            <p className="mb-2 text-[13px] font-medium text-paper/80">Order to cover</p>
            <div className="inline-flex rounded-full border border-paper/30 p-1">
              {[1, 2, 3].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`num rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${months === m ? 'bg-paper text-brand' : 'text-paper/80 hover:text-paper'}`}
                >
                  {m} month{m > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface p-8 md:col-span-7 md:p-10">
        <p className="eyebrow">Suggested order</p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-[15px] font-medium">{l.product.shortName}</p>
                <p className="text-[12px] text-ink-3">{l.variant.shortLabel ?? l.variant.label}</p>
              </div>
              <div className="text-right">
                <p className="num text-[15px] font-semibold">{l.cartons} carton{l.cartons === 1 ? '' : 's'}</p>
                <p className="num text-[12px] text-ink-3">{fmt(cartonPrice(l.variant, l.cartons) * l.cartons)} ex GST</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-[13px] text-ink-2">Estimated total, ex GST</span>
          <span className="num font-display text-[32px] font-medium leading-none tracking-[-0.01em]">{fmt(total)}</span>
        </div>
        <button type="button" className="btn-primary mt-6 w-full" onClick={useSuggestion}>
          Use this as my order
        </button>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
          Estimate only, based on 22 working days a month and typical office use. Cartons are rounded up so you do not run short. Replaces anything already in your order.
        </p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-paper/80">{label}</label>
      <input
        type="number"
        min="0"
        max="5000"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || '0', 10)))}
        onFocus={(e) => e.target.select()}
        className="num w-full rounded-md border border-paper/20 bg-brand-2 px-4 py-3 text-xl font-semibold text-paper focus:border-paper focus:outline-none"
      />
      <p className="mt-1.5 text-[12px] text-paper/50">{hint}</p>
    </div>
  )
}
