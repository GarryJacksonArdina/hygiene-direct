import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { fmt } from '../lib/pricing'

export default function Confirmed() {
  const { state } = useLocation()
  const { lastOrder } = useCart()
  const order = state ?? lastOrder

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">No recent order found</h1>
        <Link to="/" className="btn-primary mt-8">Back to products</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="card p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4L8.5 12l6.8-6.7a1 1 0 0 1 1.4 0z" clipRule="evenodd" /></svg>
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Thanks, your order is in</h1>
        <p className="mt-2 text-ink-500">
          Order reference <span className="font-bold text-ink-900">{order.orderRef}</span>. We have emailed a confirmation to {order.customer?.email}. A tax invoice follows once we have confirmed stock, and delivery is usually {site.deliveryLeadTime}.
        </p>

        <ul className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
          {order.detail?.map((d) => (
            <li key={d.name + d.variant} className="flex justify-between gap-4 py-3 text-sm">
              <span><span className="font-semibold">{d.qty} x {d.name}</span> <span className="text-ink-500">· {d.variant}</span></span>
              <span className="font-semibold">{fmt(d.price * d.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-ink-500">Delivery</dt><dd>{order.totals.delivery === 0 ? 'Free' : fmt(order.totals.delivery)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">GST</dt><dd>{fmt(order.totals.gst)}</dd></div>
          <div className="flex justify-between text-base font-extrabold"><dt>Total inc GST</dt><dd>{fmt(order.totals.total)}</dd></div>
        </dl>

        <div className="mt-8 rounded-xl bg-ink-100 p-4 text-sm text-ink-700">
          <p className="font-semibold">Delivering to</p>
          <p>{order.customer?.businessName}, {order.customer?.street}, {order.customer?.suburb} {order.customer?.state} {order.customer?.postcode}</p>
          {order.customer?.poNumber && <p className="mt-1">PO number: {order.customer.poNumber}</p>}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">Back to products</Link>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>Print this page</button>
        </div>
        <p className="mt-6 text-xs text-ink-500">Need to change something? Call {site.phone} or reply to your confirmation email and quote {order.orderRef}.</p>
      </div>
    </main>
  )
}
