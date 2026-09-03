import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { clearPendingOrder, fetchCheckoutSession, readPendingOrder } from '../lib/forms'
import { fmt } from '../lib/pricing'

export default function Confirmed() {
  const { state } = useLocation()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const { lastOrder, saveLastOrder, clear } = useCart()
  const [cardOrder, setCardOrder] = useState(null)
  const [cardStatus, setCardStatus] = useState(sessionId ? 'checking' : 'none') // checking | paid | unpaid | error

  useEffect(() => {
    if (!sessionId) return
    let alive = true
    fetchCheckoutSession(sessionId)
      .then((s) => {
        if (!alive) return
        const pending = readPendingOrder()
        const record = {
          ...(pending ?? { orderRef: s.orderRef, customer: { email: s.email }, totals: { total: s.amountTotal, gst: 0, delivery: 0 }, detail: [] }),
          orderRef: pending?.orderRef ?? s.orderRef,
          paymentMethod: 'card',
          paid: s.paid,
          paymentRef: s.paymentRef,
        }
        setCardOrder(record)
        if (s.paid) {
          saveLastOrder(record)
          clear()
          clearPendingOrder()
          setCardStatus('paid')
        } else {
          setCardStatus('unpaid')
        }
      })
      .catch(() => alive && setCardStatus('error'))
    return () => { alive = false }
  }, [sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (sessionId && cardStatus === 'checking') {
    return (
      <Shell eyebrow="One moment" title="Confirming your payment…">
        <p className="text-[15px] text-ink-2">This only takes a second.</p>
      </Shell>
    )
  }
  if (sessionId && cardStatus === 'error') {
    return (
      <Shell eyebrow="Payment" title="We could not confirm the payment status.">
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-2">If your card was charged you will still receive a Stripe receipt by email and we will process the order. Call <span className="num">{site.phone}</span> if you are unsure.</p>
        <Link to="/" className="btn-primary mt-8">Back to the range</Link>
      </Shell>
    )
  }

  const order = cardOrder ?? state ?? lastOrder
  const paidByCard = order?.paymentMethod === 'card' && order?.paid

  if (!order) {
    return (
      <Shell eyebrow="Orders" title="No recent order found.">
        <Link to="/" className="btn-primary mt-4">Back to the range</Link>
      </Shell>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Order {order.orderRef}</p>
          <h1 className="display mt-3 text-[44px] leading-[1.02] md:text-[56px]">{paidByCard ? 'Paid. Thank you.' : 'Received. Thank you.'}</h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2">
            {paidByCard
              ? <>Your card payment of <span className="num">{fmt(order.totals.total)}</span> went through. A tax receipt from Stripe is on its way to {order.customer?.email}. Delivery is usually {site.deliveryLeadTime}.</>
              : <>A confirmation has gone to {order.customer?.email}. A tax invoice follows once stock is confirmed, and delivery is usually {site.deliveryLeadTime}.</>}
          </p>
          {paidByCard && order.paymentRef && (
            <p className="num mt-4 text-[12px] text-ink-3">Payment reference {order.paymentRef}</p>
          )}
          {cardStatus === 'unpaid' && (
            <p className="mt-5 border-l-2 border-warn bg-warn-bg px-4 py-3 text-[13px] text-warn">Payment has not completed yet. If you closed the payment page, go back to your order and try again.</p>
          )}
          {order.delivered === false && (
            <p className="mt-5 border-l-2 border-warn bg-warn-bg px-4 py-3 text-[13px] text-warn">Test mode: order notifications are not connected on this deployment yet, so nobody has been emailed. See the README to switch them on.</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary">Back to the range</Link>
            <button type="button" className="btn-secondary" onClick={() => window.print()}>Print</button>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ul className="divide-y divide-line border-y border-line">
            {order.detail?.map((d) => (
              <li key={d.name + d.variant} className="flex justify-between gap-6 py-4 text-[14px]">
                <span><span className="num font-medium">{d.qty} ×</span> {d.name} <span className="text-ink-3">· {d.variant}</span></span>
                <span className="num font-medium">{fmt(d.price * d.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="num mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><dt className="text-ink-2">Delivery</dt><dd>{order.totals.delivery === 0 ? 'Free' : fmt(order.totals.delivery)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-2">GST</dt><dd>{fmt(order.totals.gst)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-line pt-4"><dt className="font-medium">Total inc GST</dt><dd className="font-display text-[30px] font-medium leading-none">{fmt(order.totals.total)}</dd></div>
          </dl>
          <div className="mt-8 border-t border-line pt-6 text-[14px] text-ink-2">
            <p className="eyebrow !text-ink-3">Delivering to</p>
            <p className="mt-2 text-ink">{order.customer?.businessName}</p>
            <p>{order.customer?.street}, {order.customer?.suburb} {order.customer?.state} <span className="num">{order.customer?.postcode}</span></p>
            {order.customer?.poNumber && <p className="num mt-1">PO {order.customer.poNumber}</p>}
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-ink-3">Need to change something? Call <span className="num">{site.phone}</span> or reply to your confirmation email quoting {order.orderRef}.</p>
        </div>
      </div>
    </main>
  )
}

function Shell({ eyebrow, title, children }) {
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-28 sm:px-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-[40px] leading-[1.05]">{title}</h1>
      <div className="mt-4">{children}</div>
    </main>
  )
}
