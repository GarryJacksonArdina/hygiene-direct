import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { fmt } from '../lib/pricing'

export default function OrderSummary({ compact = false }) {
  const { totals } = useCart()
  const toFree = site.freeDeliveryThresholdExGst - totals.subtotal
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={fmt(totals.subtotal)} />
      {totals.savings > 0 && <Row label="Volume discount" value={`Saved ${fmt(totals.savings)}`} accent />}
      <Row label="Delivery" value={totals.delivery === 0 ? 'Free' : fmt(totals.delivery)} />
      {totals.subtotal > 0 && toFree > 0 && !compact && (
        <p className="text-xs text-ink-500">Add {fmt(toFree)} more for free delivery.</p>
      )}
      <Row label="GST (10%)" value={fmt(totals.gst)} />
      <div className="flex items-baseline justify-between border-t border-ink-300/60 pt-3">
        <dt className="text-base font-bold">Total inc GST</dt>
        <dd className="text-2xl font-extrabold tracking-tight">{fmt(totals.total)}</dd>
      </div>
    </dl>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className={`font-semibold ${accent ? 'text-brand-700' : ''}`}>{value}</dd>
    </div>
  )
}
