import { useState } from 'react'
import { site } from '../data/site'
import { submitAccountEnquiry } from '../lib/forms'

export default function Account() {
  const [form, setForm] = useState({ businessName: '', contactName: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await submitAccountEnquiry(form)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">30 day account</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Order now, pay on invoice</h1>
          <p className="mt-4 text-ink-500">
            A trade account lets your team order without chasing a card each time. We email a tax invoice with every delivery and a statement at month end. Payment is due 30 days from invoice.
          </p>
          <h2 className="mt-8 font-bold">What we need</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>· Registered business name and ABN</li>
            <li>· Accounts payable contact and email for invoices</li>
            <li>· Delivery address or addresses</li>
            <li>· A rough idea of how often you will order</li>
          </ul>
          <h2 className="mt-8 font-bold">Who gets approved</h2>
          <p className="mt-2 text-sm text-ink-700">
            Schools, government sites, property managers, medical and professional practices, and existing {site.parentCompany} cleaning clients are usually approved same business day. Other businesses may be asked for a trade reference or to prepay the first order.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {status === 'done' ? (
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Thanks, we are on it</h2>
              <p className="mt-2 text-ink-500">We will email you the short account form and confirm terms, usually within one business day.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="text-xl font-extrabold tracking-tight">Apply in a minute</h2>
              <Field label="Business name" required value={form.businessName} onChange={set('businessName')} autoComplete="organization" />
              <Field label="Your name" required value={form.contactName} onChange={set('contactName')} autoComplete="name" />
              <Field label="Email" required type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              <Field label="Phone" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              <div>
                <label className="label" htmlFor="message">Anything we should know? (optional)</label>
                <textarea id="message" rows="3" className="input" placeholder="Number of sites, how often you order, dispensers you have" value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" className="btn-primary w-full !py-4" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Request an account'}
              </button>
              {status === 'error' && (
                <p className="text-sm text-red-700">Could not send just now. Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

function Field({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return (
    <div>
      <label className="label" htmlFor={id}>{label}{props.required && <span className="text-red-600"> *</span>}</label>
      <input id={id} className="input" {...props} />
    </div>
  )
}
