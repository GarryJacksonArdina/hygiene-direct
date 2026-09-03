import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { fmt } from '../lib/pricing'

export default function OrderSummary({ compact = false }) {
  const { totals } = useCart()
  const toFree = site.freeDeliveryThresholdExGst - totals.subtotal
  return (
    <dl className="num space-y-2.5 text-[14px]">
      <Row label="Subtotal" value={fmt(totals.subtotal)} />
      {totals.savings > 0 && <Row label="Volume pricing" value={`Saved ${fmt(totals.savings)}`} accent />}
      <Row label="Delivery" value={totals.delivery === 0 ? 'Free' : fmt(totals.delivery)} />
      {totals.subtotal > 0 && toFree > 0 && !compact && <p className="text-[12px] text-ink-3">Add {fmt(toFree)} more for free delivery.</p>}
      <Row label="GST 10%" value={fmt(totals.gst)} />
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="text-[14px] font-medium">Total inc GST</dt>
        <dd className="font-display text-[30px] font-medium leading-none tracking-[-0.01em]">{fmt(totals.total)}</dd>
      </div>
    </dl>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-2">{label}</dt>
      <dd className={`font-medium ${accent ? 'text-brand' : ''}`}>{value}</dd>
    </div>
  )
}
