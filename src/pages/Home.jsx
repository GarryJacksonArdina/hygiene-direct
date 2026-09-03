import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import UsageCalculator from '../components/UsageCalculator'
import { products } from '../data/products'
import { site } from '../data/site'
import { useCart } from '../context/CartContext'
import { fmt } from '../lib/pricing'

export default function Home() {
  const { lastOrder, replace } = useCart()

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-100),_transparent_55%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="chip bg-brand-100 text-brand-800">By {site.parentCompany}</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Toilet paper, hand towel and soap. <span className="text-brand-700">Delivered direct.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-500">
              Four products. Carton pricing. No account minimums and no sales calls. Order in under two minutes and we will deliver across {site.deliveryArea} in {site.deliveryLeadTime}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#products" className="btn-primary !px-6 !py-3.5 !text-base">Shop the range</a>
              <a href="#calculator" className="btn-secondary !px-6 !py-3.5 !text-base">Work out what I need</a>
            </div>
            {lastOrder && (
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <div className="text-sm">
                  <p className="font-bold text-brand-900">Welcome back, {lastOrder.businessName}</p>
                  <p className="text-ink-700">Last order {lastOrder.orderRef} · {lastOrder.cartonCount} cartons · {fmt(lastOrder.totals.total)} inc GST</p>
                </div>
                <Link to="/order" onClick={() => replace(lastOrder.lines)} className="btn-primary !py-2">Reorder the same</Link>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Stat value="4" label="products, nothing you don't need" />
            <Stat value={`${site.deliveryLeadTime.split(' ')[0]} to ${site.deliveryLeadTime.split(' ')[2]}`} label="business days delivery" />
            <Stat value="30 day" label="accounts for approved businesses" />
            <Stat value="10%" label="off any line of 10+ cartons" />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-ink-300/60 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-sm text-ink-700 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <Trust>Prices shown ex GST and inc GST</Trust>
          <Trust>Free delivery on orders over {fmt(site.freeDeliveryThresholdExGst)} ex GST</Trust>
          <Trust>Same stock we use on our own cleaning contracts</Trust>
          <Trust>Tax invoice emailed with every order</Trust>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-700">The range</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Everything a commercial washroom needs</h2>
          </div>
          <p className="max-w-md text-sm text-ink-500">
            Prices are per carton. Order 5 or more cartons of any line for 5% off, 10 or more for 10% off.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6">
        <UsageCalculator />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">How it works</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Ordering built for busy businesses</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-4">
          <Step n="1" title="Pick your cartons">Add what you need. Prices update as you go, volume discounts apply automatically.</Step>
          <Step n="2" title="Enter delivery details">Business name, delivery address and a PO number if you use them. That is it.</Step>
          <Step n="3" title="We confirm and deliver">You get an order confirmation straight away and a tax invoice with delivery in {site.deliveryLeadTime}.</Step>
          <Step n="4" title="Reorder in one click">Your last order is saved on this device. Next time, hit reorder and you are done.</Step>
        </ol>
      </section>

      {/* Account */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="card grid gap-6 p-8 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Prefer to pay on invoice?</h2>
            <p className="mt-2 text-ink-500">
              Approved businesses can order on 30 day account terms. Schools, property managers, medical practices and existing {site.parentCompany} cleaning clients are usually approved same day.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/account" className="btn-primary">Apply for a 30 day account</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">FAQ</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Common questions</h2>
        <div className="mt-8 divide-y divide-ink-300/60">
          <Faq q="Is there a minimum order?">No. Order one carton if that is all you need. Orders under {fmt(site.freeDeliveryThresholdExGst)} ex GST have a flat {fmt(site.deliveryFeeExGst)} delivery fee.</Faq>
          <Faq q="Where do you deliver?">{site.deliveryArea}. If you are outside this area, email us and we will let you know if we can help.</Faq>
          <Faq q="How do I pay?">New customers pay by bank transfer or card on the tax invoice before delivery. Approved account customers get 30 day terms. You can apply for an account in about a minute.</Faq>
          <Faq q="Will the paper fit my dispensers?">Our toilet rolls fit standard single roll and double roll dispensers. Our slimline and ultraslim hand towel fit the common interleaved dispensers. If you are not sure, send us a photo of your dispenser and we will confirm.</Faq>
          <Faq q="Can you set up dispensers too?">Yes. {site.parentCompany} can supply and install dispensers as part of a cleaning contract or as a one off. Mention it in the delivery instructions when you order.</Faq>
          <Faq q="Do you offer regular scheduled deliveries?">Yes. Tell us how often you want stock in the notes on your order, or ask when you apply for an account, and we will set up a standing order.</Faq>
        </div>
      </section>
    </main>
  )
}

function Stat({ value, label }) {
  return (
    <div className="card p-5">
      <p className="text-3xl font-extrabold tracking-tight text-brand-700">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  )
}

function Trust({ children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4L8.5 12l6.8-6.7a1 1 0 0 1 1.4 0z" clipRule="evenodd" /></svg>
      </span>
      <span>{children}</span>
    </div>
  )
}

function Step({ n, title, children }) {
  return (
    <li className="card p-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-extrabold text-white">{n}</span>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-500">{children}</p>
    </li>
  )
}

function Faq({ q, children }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
        {q}
        <span className="text-ink-500 transition group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <p className="mt-2 text-sm text-ink-500">{children}</p>
    </details>
  )
}
