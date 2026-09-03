import { site } from '../data/site'
import { fmt } from '../lib/pricing'

// Plain language terms of trade. Have these reviewed before go live.
export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of trade</h1>
      <p className="mt-2 text-sm text-ink-500">{site.name} is a trading name of {site.parentEntity} (ABN {site.abn}). These terms apply to every order placed through this site.</p>

      <div className="prose-sm mt-8 space-y-6 text-ink-700">
        <Section title="1. Orders">
          Submitting an order on this site is an offer to purchase. We accept your order when we email a confirmation or tax invoice. We may decline or limit an order, for example where stock is short or the delivery address is outside our service area, and will tell you before charging anything.
        </Section>
        <Section title="2. Pricing and GST">
          Prices are in Australian dollars per carton and are shown ex GST and inc GST. Volume discounts apply per product line at the carton quantities shown on the site. Prices may change without notice, but the price shown when we confirm your order is the price you pay.
        </Section>
        <Section title="3. Delivery">
          We deliver across {site.deliveryArea}. Delivery is free for orders of {fmt(site.freeDeliveryThresholdExGst)} ex GST or more, otherwise a delivery fee of {fmt(site.deliveryFeeExGst)} ex GST applies. Typical lead time is {site.deliveryLeadTime} from confirmation. Delivery times are estimates. Goods are delivered to the ground floor entry, loading dock or reception unless agreed otherwise.
        </Section>
        <Section title="4. Payment">
          Unless you hold an approved account, payment is due before delivery by bank transfer or card against our tax invoice. Approved account customers must pay within 30 days of the invoice date. We may withhold further deliveries and charge reasonable recovery costs on overdue accounts. Title in the goods passes to you when we receive payment in full.
        </Section>
        <Section title="5. Returns and problems">
          Check your delivery on arrival. Tell us about any shortage or damage within 2 business days and we will replace or credit it. We do not accept returns of unopened stock ordered in error unless agreed, and a restocking fee may apply. Nothing in these terms limits your rights under the Australian Consumer Law.
        </Section>
        <Section title="6. Privacy">
          We use your details only to process and deliver your order, issue invoices and contact you about your account. We do not sell your information. Your last order is stored in your browser on your device so you can reorder quickly; clear your browser storage to remove it.
        </Section>
        <Section title="7. Contact">
          Questions about these terms or an order: {site.email} or {site.phone}.
        </Section>
      </div>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </section>
  )
}
