import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary'
import QtyStepper from '../components/QtyStepper'
import { useCart } from '../context/CartContext'
import { site } from '../data/site'
import { makeOrderRef, submitNetlifyForm } from '../lib/forms'
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
  paymentMethod: 'invoice-prepay',
}

export default function Order() {
  const { lines, totals, cartonCount, setQty, remove, clear, lastOrder, saveLastOrder } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(lastOrder?.customer ?? {}) }))
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState('')

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
    const payload = {
      orderRef,
      ...form,
      orderLines: `${orderLines}\n\nDelivery: ${totals.delivery === 0 ? 'Free' : fmt(totals.delivery)}`,
      subtotalExGst: totals.exGst.toFixed(2),
      gst: totals.gst.toFixed(2),
      totalIncGst: totals.total.toFixed(2),
    }
    const record = {
      orderRef,
      placedAt: new Date().toISOString(),
      businessName: form.businessName,
      customer: form,
      lines: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, qty: l.qty })),
      detail: lines.map((l) => ({ name: l.product.name, variant: l.variant.label, qty: l.qty, price: cartonPrice(l.variant, l.qty) })),
      totals,
      cartonCount,
    }

    try {
      await submitNetlifyForm('order', payload)
      saveLastOrder(record)
      clear()
      navigate('/order-confirmed', { state: record })
    } catch (err) {
      console.error(err)
      setStatus('error')
      const mail = `mailto:${site.email}?subject=${encodeURIComponent(`Order ${orderRef} from ${form.businessName}`)}&body=${encodeURIComponent(`${orderLines}\n\nTotal inc GST: ${fmt(totals.total)}\n\nBusiness: ${form.businessName}\nContact: ${form.contactName}\nPhone: ${form.phone}\nDeliver to: ${form.street}, ${form.suburb} ${form.state} ${form.postcode}\nPO: ${form.poNumber}\nInstructions: ${form.deliveryInstructions}\nPayment: ${form.paymentMethod}`)}`
      setErrorMsg(mail)
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Your order is empty</h1>
        <p className="mt-3 text-ink-500">Add a few cartons and come back here to check out.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/#products" className="btn-primary">Browse products</Link>
          <Link to="/#calculator" className="btn-secondary">Use the calculator</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Your order</h1>
      <p className="mt-1 text-ink-500">{cartonCount} carton{cartonCount === 1 ? '' : 's'} · review, add your details, submit. No payment taken online.</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-5" noValidate={false}>
        <div className="space-y-8 lg:col-span-3">
          {/* Lines */}
          <section className="card divide-y divide-ink-100">
            {lines.map((l) => (
              <div key={l.variantId} className="flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{l.product.name}</p>
                  <p className="text-sm text-ink-500">{l.variant.label}</p>
                  <p className="mt-1 text-xs text-ink-500">{fmt(cartonPrice(l.variant, l.qty))} per carton ex GST</p>
                </div>
                <QtyStepper value={l.qty} min={0} onChange={(n) => setQty(l.productId, l.variantId, n)} />
                <div className="w-24 text-right font-bold">{fmt(cartonPrice(l.variant, l.qty) * l.qty)}</div>
                <button type="button" onClick={() => remove(l.productId, l.variantId)} className="text-sm font-semibold text-ink-500 hover:text-red-600" aria-label={`Remove ${l.product.name}`}>
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between p-5">
              <Link to="/#products" className="text-sm font-semibold text-brand-700 hover:underline">+ Add more products</Link>
              <button type="button" onClick={clear} className="text-sm font-semibold text-ink-500 hover:text-red-600">Clear order</button>
            </div>
          </section>

          {/* Details */}
          <section className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight">Business details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Business name" required value={form.businessName} onChange={set('businessName')} autoComplete="organization" />
              <Input label="ABN (optional)" value={form.abn} onChange={set('abn')} inputMode="numeric" />
              <Input label="Contact name" required value={form.contactName} onChange={set('contactName')} autoComplete="name" />
              <Input label="Phone" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              <Input label="Email for confirmation and invoice" required type="email" value={form.email} onChange={set('email')} autoComplete="email" className="sm:col-span-2" />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight">Delivery</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
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
            <p className="mt-4 text-sm text-ink-500">We deliver across {site.deliveryArea} in {site.deliveryLeadTime}. Outside this area, submit anyway and we will confirm before charging you anything.</p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight">Payment</h2>
            <div className="mt-5 space-y-3">
              <Radio name="paymentMethod" value="invoice-prepay" checked={form.paymentMethod === 'invoice-prepay'} onChange={set('paymentMethod')} title="Pay on invoice before delivery" desc="We email a tax invoice. Pay by bank transfer or card and we deliver once it clears. Best for first orders." />
              <Radio name="paymentMethod" value="account-30" checked={form.paymentMethod === 'account-30'} onChange={set('paymentMethod')} title="30 day account" desc={`For approved account customers and existing ${site.parentCompany} clients. Not on an account yet? Choose this and we will send you the short application with your confirmation.`} />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-2">
          <div className="card sticky top-24 p-6">
            <h2 className="text-lg font-extrabold tracking-tight">Summary</h2>
            <div className="mt-4">
              <OrderSummary />
            </div>
            <button type="submit" className="btn-primary mt-6 w-full !py-4 !text-base" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending order…' : 'Submit order'}
            </button>
            <p className="mt-3 text-xs text-ink-500">
              By submitting you agree to our <Link to="/terms" className="underline">terms of trade</Link>. You will receive an email confirmation. Nothing is charged online.
            </p>
            {status === 'error' && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold">We could not send your order automatically.</p>
                <p className="mt-1">Please <a className="underline" href={errorMsg}>email it to us instead</a> or call {site.phone}. Your order details are prefilled in the email.</p>
              </div>
            )}
          </div>
        </aside>
      </form>
    </main>
  )
}

function Input({ label, className = '', ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}{props.required && <span className="text-red-600"> *</span>}</label>
      <input id={id} className="input" {...props} />
    </div>
  )
}

function Radio({ title, desc, ...props }) {
  return (
    <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${props.checked ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200' : 'border-ink-300 hover:border-ink-500'}`}>
      <input type="radio" className="mt-1 h-4 w-4 accent-brand-700" {...props} />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-500">{desc}</span>
      </span>
    </label>
  )
}
