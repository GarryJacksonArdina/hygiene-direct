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
    <main className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">Trade accounts</p>
          <h1 className="display mt-3 text-[44px] leading-[1.02] md:text-[56px]">Order now, <span className="italic text-brand">pay on invoice.</span></h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink-2">
            A trade account lets your team order without chasing a card each time. A tax invoice comes with every delivery and a statement at month end. Payment is due 30 days from invoice.
          </p>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
              <dt className="text-[13px] font-medium text-ink-3">What we need</dt>
              <dd className="text-[14px] leading-relaxed text-ink-2">Registered business name and ABN. Accounts payable contact and email. Delivery address or addresses. A rough idea of how often you will order.</dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
              <dt className="text-[13px] font-medium text-ink-3">Who is approved</dt>
              <dd className="text-[14px] leading-relaxed text-ink-2">Schools, government sites, property managers, medical and professional practices, and existing {site.parentCompany} clients, usually the same business day. Others may be asked for a trade reference or to prepay the first order.</dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
              <dt className="text-[13px] font-medium text-ink-3">Terms</dt>
              <dd className="text-[14px] leading-relaxed text-ink-2">30 days from invoice date. Standing orders available on request.</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="panel p-7 sm:p-9">
            {status === 'done' ? (
              <div>
                <p className="eyebrow">Sent</p>
                <h2 className="display mt-3 text-[30px] leading-[1.05]">Thanks, we are on it.</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">We will email you the short account form and confirm terms, usually within one business day.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <h2 className="display text-[26px]">Apply in a minute</h2>
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
                  <p className="border-l-2 border-danger bg-danger-bg px-4 py-3 text-[13px] text-danger">Could not send just now. Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> or call <span className="num">{site.phone}</span>.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return (
    <div>
      <label className="label" htmlFor={id}>{label}{props.required && <span className="text-ink-3"> *</span>}</label>
      <input id={id} className="input" {...props} />
    </div>
  )
}
