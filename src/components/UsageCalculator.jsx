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
    <div className="card overflow-hidden">
      <div className="grid md:grid-cols-5">
        <div className="bg-brand-800 p-6 text-white md:col-span-2 md:p-8">
          <h3 className="text-2xl font-extrabold tracking-tight">Not sure how much to order?</h3>
          <p className="mt-2 text-sm text-brand-100">
            Tell us roughly how many people use your washrooms and we will suggest a starting order. You can adjust everything before you submit.
          </p>
          <div className="mt-6 space-y-4">
            <Field label="Staff on site" value={staff} onChange={setStaff} hint="People at work on a normal day" />
            <Field label="Visitors per day" value={visitors} onChange={setVisitors} hint="Customers, students, patients, contractors" />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-100">Order to cover</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${months === m ? 'bg-white text-brand-800' : 'bg-brand-700 text-white hover:bg-brand-600'}`}
                  >
                    {m} month{m > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:col-span-3 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Suggested order</p>
          <ul className="mt-3 divide-y divide-ink-100">
            {lines.map((l) => (
              <li key={l.product.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold">{l.product.shortName}</p>
                  <p className="text-xs text-ink-500">{l.variant.shortLabel ?? l.variant.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{l.cartons} carton{l.cartons === 1 ? '' : 's'}</p>
                  <p className="text-xs text-ink-500">{fmt(cartonPrice(l.variant, l.cartons) * l.cartons)} ex GST</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-ink-300/60 pt-4">
            <span className="text-sm font-semibold text-ink-700">Estimated total</span>
            <span className="text-2xl font-extrabold tracking-tight">{fmt(total)} <span className="text-xs font-medium text-ink-500">ex GST</span></span>
          </div>
          <button type="button" className="btn-primary mt-5 w-full" onClick={useSuggestion}>
            Use this as my order
          </button>
          <p className="mt-3 text-xs text-ink-500">
            Estimate only. Based on 22 working days a month and typical office use. Cartons are rounded up so you do not run short. Replaces anything already in your order.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-100">{label}</label>
      <input
        type="number"
        min="0"
        max="5000"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || '0', 10)))}
        onFocus={(e) => e.target.select()}
        className="w-full rounded-xl border-0 bg-white px-4 py-3 text-lg font-bold text-ink-900 focus:outline-none focus:ring-4 focus:ring-brand-500"
      />
      <p className="mt-1 text-xs text-brand-200">{hint}</p>
    </div>
  )
}
