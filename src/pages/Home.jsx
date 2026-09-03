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
      {/* Opening statement */}
      <section className="mx-auto max-w-[1200px] px-5 pb-14 pt-16 sm:px-8 md:pt-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Commercial washroom supply · {site.deliveryArea}</p>
            <h1 className="display mt-5 text-[44px] leading-[1.02] sm:text-[60px] md:text-[72px]">
              Everything your washrooms need. <span className="italic text-brand">Nothing they don't.</span>
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="max-w-sm text-[16px] leading-relaxed text-ink-2">
              Two ply and three ply toilet tissue, hand towel and hand soap, by the carton. Order in two minutes, delivered in {site.deliveryLeadTime}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/#products" className="btn-primary">See the range</Link>
              <Link to="/#calculator" className="btn-secondary">Work out what I need</Link>
            </div>
          </div>
        </div>

        {lastOrder && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <div className="text-[14px]">
              <p className="font-medium">Welcome back, {lastOrder.businessName}</p>
              <p className="num text-ink-2">Last order {lastOrder.orderRef} · {lastOrder.cartonCount} cartons · {fmt(lastOrder.totals.total)} inc GST</p>
            </div>
            <Link to="/order" onClick={() => replace(lastOrder.lines)} className="btn-secondary !py-2.5">Reorder the same</Link>
          </div>
        )}

        <dl className="mt-14 grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:grid-cols-4">
          <Fact value="4" label="products. Nothing you do not need." />
          <Fact value="1 to 3" label="business days to your door." />
          <Fact value="30 day" label="accounts for approved businesses." />
          <Fact value="10%" label="off any line of ten cartons or more." />
        </dl>
      </section>

      {/* Range */}
      <section id="products" className="scroll-mt-20 border-t border-line bg-stage/40">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The range</p>
              <h2 className="display mt-3 text-[36px] leading-[1.05] md:text-[44px]">Four products, chosen once.</h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-ink-2">
              Priced per carton, ex GST. Five or more cartons of a line saves 5%, ten or more saves 10%.
            </p>
          </div>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
        <UsageCalculator />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-8 sm:px-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-3 text-[36px] leading-[1.05]">Ordering without the back and forth.</h2>
          </div>
          <ol className="divide-y divide-line border-y border-line md:col-span-8">
            <Step n="1" title="Pick your cartons">Prices update as you go and volume pricing applies on its own.</Step>
            <Step n="2" title="Add delivery details">Business name, address, and a PO number if you use them.</Step>
            <Step n="3" title="Pay how you prefer">Card now, invoice before delivery, or a 30 day account.</Step>
            <Step n="4" title="We deliver">Confirmation straight away, tax invoice with the goods, delivery in {site.deliveryLeadTime}. Next time, reorder in one click.</Step>
          </ol>
        </div>
      </section>

      {/* Account */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-8 bg-ink px-8 py-12 text-paper md:grid-cols-12 md:items-center md:px-14 md:py-16">
          <div className="md:col-span-8">
            <p className="eyebrow !text-paper/50">Trade accounts</p>
            <h2 className="display mt-3 text-[36px] leading-[1.05] md:text-[44px]">Prefer to pay on invoice?</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-paper/70">
              Schools, property managers, medical practices and existing {site.parentCompany} clients are usually approved for 30 day terms the same day.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/account" className="btn-light">Apply for an account</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-8 sm:px-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Questions</p>
            <h2 className="display mt-3 text-[36px] leading-[1.05]">The things people ask.</h2>
          </div>
          <div className="divide-y divide-line border-y border-line md:col-span-8">
            <Faq q="Is there a minimum order?">No. Order one carton if that is all you need. Orders under {fmt(site.freeDeliveryThresholdExGst)} ex GST carry a flat {fmt(site.deliveryFeeExGst)} delivery fee.</Faq>
            <Faq q="Where do you deliver?">{site.deliveryArea}. Outside that, email us and we will tell you straight whether we can help.</Faq>
            <Faq q="How do I pay?">Card at checkout through Stripe, bank transfer against a tax invoice before delivery, or 30 day terms on an approved account.</Faq>
            <Faq q="Will the paper fit my dispensers?">Our rolls fit standard single and double roll dispensers. Slimline and ultraslim towel fit the common interleaved dispensers. Unsure? Send a photo of your dispenser and we will confirm.</Faq>
            <Faq q="Can you supply and fit dispensers?">Yes. {site.parentCompany} supplies and installs dispensers as part of a cleaning contract or as a one off. Mention it in your delivery notes.</Faq>
            <Faq q="Do you do standing orders?">Yes. Tell us how often you want stock in your order notes, or when you apply for an account, and we will set it up.</Faq>
          </div>
        </div>
      </section>
    </main>
  )
}

function Fact({ value, label }) {
  return (
    <div className="pr-6">
      <dt className="num font-display text-[40px] font-medium leading-none tracking-[-0.02em]">{value}</dt>
      <dd className="mt-2 max-w-[18ch] text-[13px] leading-snug text-ink-2">{label}</dd>
    </div>
  )
}

function Step({ n, title, children }) {
  return (
    <li className="grid grid-cols-[3rem_1fr] gap-4 py-6">
      <span className="num font-display text-[22px] font-medium text-ink-3">{n}</span>
      <div>
        <h3 className="text-[17px] font-medium">{title}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{children}</p>
      </div>
    </li>
  )
}

function Faq({ q, children }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
        {q}
        <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
          <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
          <span className="absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform group-open:scale-y-0" />
        </span>
      </summary>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-2">{children}</p>
    </details>
  )
}
