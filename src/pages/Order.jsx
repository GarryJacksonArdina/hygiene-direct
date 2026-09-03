import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary'
import QtyStepper from '../components/QtyStepper'
import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { createCheckoutSession, fetchPaymentConfig, makeOrderRef, savePendingOrder, submitOrder } from '../lib/forms'
import { cartonPrice, fmt } from '../lib/pricing'

const EMPTY = {
  businessName: '',
  abn: '',
  contactName: '',
  email: '',
  phone: '',
  street: '',
  suburb: '',
  state: 'QLD',
  postcode: '',
  poNumber: '',
  deliveryInstructions: '',
  paymentMethod: 'card',
}

export default function Order() {
  const { lines, totals, cartonCount, setQty, remove, clear, lastOrder, saveLastOrder } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(lastOrder?.customer ?? {}) }))
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState('')
  const [payConfig, setPayConfig] = useState({ card: true, loaded: false })
  const [params] = useSearchParams()
  const cancelled = params.get('cancelled') === '1'

  useEffect(() => {
    let alive = true
    fetchPaymentConfig().then((c) => alive && setPayConfig({ ...c, loaded: true }))
    return () => { alive = false }
  }, [])
  useEffect(() => {
    if (payConfig.loaded && !payConfig.card && form.paymentMethod === 'card') {
      setForm((f) => ({ ...f, paymentMethod: 'invoice-prepay' }))
    }
  }, [payConfig, form.paymentMethod])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (lines.length === 0) return
    setStatus('submitting')
    setErrorMsg('')

    const orderRef = makeOrderRef()
    const orderLines = lines
      .map((l) => `${l.qty} x ${l.product.name} (${l.variant.label}) [${l.variant.sku}] @ ${fmt(cartonPrice(l.variant, l.qty))} ex GST = ${fmt(cartonPrice(l.variant, l.qty) * l.qty)}`)
      .join('\n')
    const record = {
      orderRef,
      placedAt: new Date().toISOString(),
      businessName: form.businessName,
      customer: form,
      paymentMethod: form.paymentMethod,
      lines: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, qty: l.qty })),
      detail: lines.map((l) => ({ name: l.product.name, variant: l.variant.label, qty: l.qty, price: cartonPrice(l.variant, l.qty) })),
      totals,
      cartonCount,
    }
    const payload = { orderRef, customer: form, lines: record.lines, paymentMethod: form.paymentMethod }

    try {
      if (form.paymentMethod === 'card') {
        savePendingOrder(record)
        const { url } = await createCheckoutSession(payload)
        if (!url) throw new Error('No checkout URL returned')
        window.location.assign(url)
        return
      }
      const res = await submitOrder(payload)
      saveLastOrder(record)
      clear()
      navigate('/order-confirmed', { state: { ...record, delivered: res.delivered } })
    } catch (err) {
      console.error(err)
      setStatus('error')
      const mail = `mailto:${site.email}?subject=${encodeURIComponent(`Order ${orderRef} from ${form.businessName}`)}&body=${encodeURIComponent(`${orderLines}\n\nTotal inc GST: ${fmt(totals.total)}\n\nBusiness: ${form.businessName}\nContact: ${form.contactName}\nPhone: ${form.phone}\nDeliver to: ${form.street}, ${form.suburb} ${form.state} ${form.postcode}\nPO: ${form.poNumber}\nInstructions: ${form.deliveryInstructions}\nPayment: ${form.paymentMethod}`)}`
      setErrorMsg({ message: err.message, mail })
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-[1200px] px-5 py-28 sm:px-8">
        <p className="eyebrow">Your order</p>
        <h1 className="display mt-3 text-[40px] leading-[1.05]">Nothing here yet.</h1>
        <p className="mt-3 text-[15px] text-ink-2">Add a few cartons and come back to check out.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/#products" className="btn-primary">See the range</Link>
          <Link to="/#calculator" className="btn-secondary">Use the calculator</Link>
        </div>
      </main>
    )
  }

  const cardOn = !(payConfig.loaded && !payConfig.card)

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
      <p className="eyebrow">Your order</p>
      <h1 className="display mt-3 text-[40px] leading-[1.05] md:text-[48px]">
        <span className="num">{cartonCount}</span> carton{cartonCount === 1 ? '' : 's'}, ready when you are.
      </h1>
      {cancelled && (
        <p className="mt-5 max-w-2xl border-l-2 border-warn bg-warn-bg px-4 py-3 text-[14px] text-warn">
          Card payment was cancelled. Your order is still here. Try again or choose an invoice option.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          {/* Lines */}
          <section>
            <SectionHead n="1" title="Cartons" />
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={l.variantId} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-5 sm:grid-cols-[1fr_auto_6rem_auto]">
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium">{l.product.name}</p>
                    <p className="text-[13px] text-ink-2">{l.variant.label}</p>
                    <p className="num mt-0.5 text-[12px] text-ink-3">{fmt(cartonPrice(l.variant, l.qty))} per carton ex GST</p>
                  </div>
                  <QtyStepper value={l.qty} min={0} onChange={(n) => setQty(l.productId, l.variantId, n)} />
                  <div className="num text-right text-[16px] font-medium">{fmt(cartonPrice(l.variant, l.qty) * l.qty)}</div>
                  <button type="button" onClick={() => remove(l.productId, l.variantId)} className="text-[13px] text-ink-3 underline decoration-line-2 underline-offset-4 transition-colors hover:text-danger" aria-label={`Remove ${l.product.name}`}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-4 text-[13px]">
              <Link to="/#products" className="font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">Add more products</Link>
              <button type="button" onClick={clear} className="text-ink-3 underline decoration-line-2 underline-offset-4 transition-colors hover:text-danger">Clear order</button>
            </div>
          </section>

          {/* Details */}
          <section>
            <SectionHead n="2" title="Business" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Business name" required value={form.businessName} onChange={set('businessName')} autoComplete="organization" />
              <Input label="ABN (optional)" value={form.abn} onChange={set('abn')} inputMode="numeric" />
              <Input label="Contact name" required value={form.contactName} onChange={set('contactName')} autoComplete="name" />
              <Input label="Phone" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              <Input label="Email for confirmation and invoice" required type="email" value={form.email} onChange={set('email')} autoComplete="email" className="sm:col-span-2" />
            </div>
          </section>

          <section>
            <SectionHead n="3" title="Delivery" />
            <div className="grid gap-5 sm:grid-cols-6">
              <Input label="Street address" required value={form.street} onChange={set('street')} autoComplete="street-address" className="sm:col-span-6" />
              <Input label="Suburb" required value={form.suburb} onChange={set('suburb')} autoComplete="address-level2" className="sm:col-span-3" />
              <div className="sm:col-span-1">
                <label className="label" htmlFor="state">State</label>
                <select id="state" className="input" value={form.state} onChange={set('state')}>
                  {['QLD', 'NSW', 'VIC', 'ACT', 'SA', 'WA', 'TAS', 'NT'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Input label="Postcode" required value={form.postcode} onChange={set('postcode')} inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" className="sm:col-span-2" />
              <Input label="Your PO number (optional)" value={form.poNumber} onChange={set('poNumber')} className="sm:col-span-3" />
              <div className="sm:col-span-6">
                <label className="label" htmlFor="deliveryInstructions">Delivery instructions (optional)</label>
                <textarea id="deliveryInstructions" rows="2" className="input" placeholder="Loading dock, reception, best days and times, who to ask for" value={form.deliveryInstructions} onChange={set('deliveryInstructions')} />
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-3">We deliver across {site.deliveryArea} in {site.deliveryLeadTime}. Outside that area, submit anyway and we will confirm before anything is charged.</p>
          </section>

          <section>
            <SectionHead n="4" title="Payment" />
            <div className="divide-y divide-line border-y border-line">
              <Radio
                name="paymentMethod"
                value="card"
                checked={form.paymentMethod === 'card'}
                onChange={set('paymentMethod')}
                disabled={!cardOn}
                title="Card, now"
                meta="Visa · Mastercard · Amex"
                desc={cardOn ? 'Secure checkout through Stripe. Fastest way to get your order moving. Tax receipt emailed straight away.' : 'Card payments are being switched on. Choose an invoice option for now.'}
              />
              <Radio name="paymentMethod" value="invoice-prepay" checked={form.paymentMethod === 'invoice-prepay'} onChange={set('paymentMethod')} title="Invoice, before delivery" meta="Bank transfer" desc="We email a tax invoice. Pay by bank transfer and we deliver once it clears." />
              <Radio name="paymentMethod" value="account-30" checked={form.paymentMethod === 'account-30'} onChange={set('paymentMethod')} title="30 day account" meta="Approved customers" desc={`For account customers and existing ${site.parentCompany} clients. Not on an account yet? Choose this and we will send the short application with your confirmation.`} />
            </div>
            {payConfig.testMode && form.paymentMethod === 'card' && (
              <p className="num mt-4 border-l-2 border-warn bg-warn-bg px-4 py-3 text-[13px] text-warn">Stripe is in test mode. Use card 4242 4242 4242 4242, any future expiry, any CVC. No real money moves.</p>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="panel sticky top-24 p-7">
            <p className="eyebrow">Summary</p>
            <div className="mt-5">
              <OrderSummary />
            </div>
            <button type="submit" className="btn-primary mt-7 w-full !py-4 !text-[15px]" disabled={status === 'submitting'}>
              {status === 'submitting'
                ? form.paymentMethod === 'card' ? 'Taking you to secure payment…' : 'Sending order…'
                : form.paymentMethod === 'card' ? <span className="num">Pay {fmt(totals.total)} by card</span> : 'Submit order'}
            </button>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
              By submitting you agree to our <Link to="/terms" className="underline decoration-line-2 underline-offset-2 hover:text-ink">terms of trade</Link>. You will receive an email confirmation.
              {form.paymentMethod === 'card' ? ' Card details are entered on Stripe’s secure page, never on this site.' : ' Nothing is charged online.'}
            </p>
            {status === 'error' && (
              <div className="mt-5 border-l-2 border-danger bg-danger-bg px-4 py-3 text-[13px] text-danger">
                <p className="font-medium">{errorMsg.message || 'We could not send your order automatically.'}</p>
                <p className="mt-1">Try again, <a className="underline" href={errorMsg.mail}>email the order to us</a> or call <span className="num">{site.phone}</span>. Your details are prefilled in the email.</p>
              </div>
            )}
          </div>
        </aside>
      </form>
    </main>
  )
}

function SectionHead({ n, title }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="num font-display text-[20px] font-medium text-ink-3">{n}</span>
      <h2 className="display text-[26px]">{title}</h2>
    </div>
  )
}

function Input({ label, className = '', ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}{props.required && <span className="text-ink-3"> *</span>}</label>
      <input id={id} className="input" {...props} />
    </div>
  )
}

function Radio({ title, meta, desc, ...props }) {
  return (
    <label className={`grid grid-cols-[1.25rem_1fr] gap-4 py-5 transition-colors ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${props.checked ? '' : 'text-ink-2 hover:text-ink'}`}>
      <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${props.checked ? 'border-ink' : 'border-line-2'}`} aria-hidden="true">
        {props.checked && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
      <input type="radio" className="sr-only" {...props} />
      <span>
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className={`text-[16px] font-medium ${props.checked ? 'text-ink' : ''}`}>{title}</span>
          <span className="text-[12px] uppercase tracking-[0.1em] text-ink-3">{meta}</span>
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">{desc}</span>
      </span>
    </label>
  )
}
