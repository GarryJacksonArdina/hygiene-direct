import { Link } from 'react-router-dom'
import Illustration from '../components/Illustration'
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
      {/* Opening */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1024px] px-5 pt-20 text-center sm:px-6 md:pt-28">
          <h1 className="display mx-auto max-w-[14ch] text-[48px] leading-[1.02] sm:text-[64px] md:text-[80px]">
            Everything your washrooms need.
          </h1>
          <p className="mx-auto mt-6 max-w-[38ch] text-[19px] leading-snug text-ink-2 md:text-[24px]">
            Toilet tissue, hand towel and hand soap by the carton. Delivered across {site.deliveryArea} in {site.deliveryLeadTime}.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <Link to="/#products" className="btn-primary">See the range</Link>
            <Link to="/#calculator" className="link">Work out what I need <Chev /></Link>
          </div>
        </div>

        {/* Family shot */}
        <div className="mx-auto mt-14 max-w-[1024px] px-5 sm:px-6">
          <div className="grid grid-cols-4 items-end gap-2 rounded-[32px] bg-stage px-4 pb-6 pt-10 sm:gap-6 sm:px-10">
            {products.map((p) => (
              <Link key={p.id} to={`/#${p.slug}`} className="group block" aria-label={p.name}>
                <Illustration kind={p.illustration} image={p.image} alt="" className="mx-auto aspect-square w-full max-w-[200px] transition-transform duration-700 ease-out group-hover:-translate-y-1 motion-reduce:transition-none" />
                <p className="mt-3 hidden text-center text-[12px] font-medium text-ink-2 sm:block">{p.shortName}</p>
              </Link>
            ))}
          </div>
        </div>

        {lastOrder && (
          <div className="mx-auto mt-8 flex max-w-[1024px] flex-wrap items-center justify-between gap-4 px-5 sm:px-6">
            <div className="text-[14px]">
              <p className="font-medium">Welcome back, {lastOrder.businessName}</p>
              <p className="num text-ink-2">Last order {lastOrder.orderRef} · {lastOrder.cartonCount} cartons · {fmt(lastOrder.totals.total)} inc GST</p>
            </div>
            <Link to="/order" onClick={() => replace(lastOrder.lines)} className="btn-secondary !py-2.5">Reorder the same</Link>
          </div>
        )}

        <dl className="mx-auto mt-16 grid max-w-[1024px] grid-cols-2 gap-y-10 px-5 text-center sm:px-6 md:mt-20 md:grid-cols-4">
          <Fact value="4" label="products. Nothing you do not need." />
          <Fact value="1 to 3" label="business days to your door." />
          <Fact value="30 day" label="accounts for approved businesses." />
          <Fact value="10%" label="off any line of ten cartons or more." />
        </dl>
      </section>

      {/* Range */}
      <section id="products" className="scroll-mt-12 bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1024px] px-5 sm:px-6">
          <div className="text-center">
            <h2 className="display text-[40px] leading-[1.05] md:text-[56px]">Four products. Chosen once.</h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-snug text-ink-2 md:text-[21px]">
              Priced per carton, ex GST. Five or more cartons of a line saves 5%. Ten or more saves 10%.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator on black */}
      <section id="calculator" className="mt-24 scroll-mt-12 bg-black py-20 md:mt-32 md:py-28">
        <div className="mx-auto max-w-[1024px] px-5 sm:px-6">
          <UsageCalculator />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-12 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1024px] px-5 sm:px-6">
          <h2 className="display text-center text-[40px] leading-[1.05] md:text-[56px]">Ordering, without the back and forth.</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
            <Step n="1" title="Pick your cartons">Prices update as you go. Volume pricing applies on its own.</Step>
            <Step n="2" title="Add delivery details">Business name, address, and a PO number if you use them.</Step>
            <Step n="3" title="Pay how you prefer">Card now, invoice before delivery, or a 30 day account.</Step>
            <Step n="4" title="We deliver">Confirmation straight away, tax invoice with the goods. Next time, reorder in one click.</Step>
          </ol>
        </div>
      </section>

      {/* Account */}
      <section className="bg-stage py-20 md:py-28">
        <div className="mx-auto max-w-[1024px] px-5 text-center sm:px-6">
          <p className="eyebrow">Trade accounts</p>
          <h2 className="display mt-3 text-[40px] leading-[1.05] md:text-[56px]">Prefer to pay on invoice?</h2>
          <p className="mx-auto mt-4 max-w-[50ch] text-[17px] leading-snug text-ink-2 md:text-[21px]">
            Schools, property managers, medical practices and existing {site.parentCompany} clients are usually approved for 30 day terms the same day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <Link to="/account" className="btn-primary">Apply for an account</Link>
            <Link to="/order" className="link">Or just order <Chev /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-12 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[720px] px-5 sm:px-6">
          <h2 className="display text-center text-[40px] leading-[1.05] md:text-[48px]">Questions</h2>
          <div className="mt-10 divide-y divide-line/70 border-y border-line/70">
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

function Chev() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
  )
}

function Fact({ value, label }) {
  return (
    <div className="px-2">
      <dt className="num display text-[44px] leading-none md:text-[56px]">{value}</dt>
      <dd className="mx-auto mt-3 max-w-[18ch] text-[14px] leading-snug text-ink-2">{label}</dd>
    </div>
  )
}

function Step({ n, title, children }) {
  return (
    <li className="text-center md:text-left">
      <span className="num display inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[15px] text-white">{n}</span>
      <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{children}</p>
    </li>
  )
}

function Faq({ q, children }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px] font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
        {q}
        <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
          <span className="absolute left-0 top-1/2 h-0.5 w-4 rounded bg-ink" />
          <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded bg-ink transition-transform group-open:scale-y-0" />
        </span>
      </summary>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{children}</p>
    </details>
  )
}
