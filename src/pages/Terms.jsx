import { site } from '../data/site'
import { fmt } from '../lib/pricing'

// Plain language terms of trade. Have these reviewed before go live.
export default function Terms() {
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-3 text-[40px] leading-[1.05]">Terms of trade</h1>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-3">{site.name} is a trading name of {site.parentEntity}, ABN <span className="num">{site.abn}</span>. These terms apply to every order placed through this site.</p>
        </div>
        <div className="divide-y divide-line border-y border-line md:col-span-7 md:col-start-6">
          <Section n="1" title="Orders">
            Submitting an order on this site is an offer to purchase. We accept your order when we email a confirmation or tax invoice. We may decline or limit an order, for example where stock is short or the delivery address is outside our service area, and will tell you before charging anything.
          </Section>
          <Section n="2" title="Pricing and GST">
            Prices are in Australian dollars per carton and are shown ex GST and inc GST. Volume pricing applies per product line at the carton quantities shown on the site. Prices may change without notice, but the price shown when we confirm your order is the price you pay.
          </Section>
          <Section n="3" title="Delivery">
            We deliver across {site.deliveryArea}. Delivery is free for orders of {fmt(site.freeDeliveryThresholdExGst)} ex GST or more, otherwise a delivery fee of {fmt(site.deliveryFeeExGst)} ex GST applies. Typical lead time is {site.deliveryLeadTime} from confirmation. Delivery times are estimates. Goods are delivered to the ground floor entry, loading dock or reception unless agreed otherwise.
          </Section>
          <Section n="4" title="Payment">
            Card payments are processed by Stripe at checkout. Unless you hold an approved account, other orders are payable before delivery by bank transfer against our tax invoice. Approved account customers must pay within 30 days of the invoice date. We may withhold further deliveries and charge reasonable recovery costs on overdue accounts. Title in the goods passes to you when we receive payment in full.
          </Section>
          <Section n="5" title="Returns and problems">
            Check your delivery on arrival. Tell us about any shortage or damage within 2 business days and we will replace or credit it. We do not accept returns of unopened stock ordered in error unless agreed, and a restocking fee may apply. Nothing in these terms limits your rights under the Australian Consumer Law.
          </Section>
          <Section n="6" title="Privacy">
            We use your details only to process and deliver your order, issue invoices and contact you about your account. We do not sell your information. Card details are handled by Stripe and never stored by us. Your last order is kept in your browser on your device so you can reorder quickly; clear your browser storage to remove it.
          </Section>
          <Section n="7" title="Contact">
            Questions about these terms or an order: {site.email} or <span className="num">{site.phone}</span>.
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({ n, title, children }) {
  return (
    <section className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr]">
      <span className="num font-display text-[20px] font-medium text-ink-3">{n}</span>
      <div>
        <h2 className="text-[17px] font-medium">{title}</h2>
        <p className="mt-2 max-w-[65ch] text-[14px] leading-relaxed text-ink-2">{children}</p>
      </div>
    </section>
  )
}
