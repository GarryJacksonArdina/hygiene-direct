// Shared server side order logic. Prices are always recalculated here from the
// catalogue so the browser can never change what gets charged.
import { findProduct, findVariant } from '../src/data/products.js'
import { cartonPrice, cartTotals } from '../src/lib/pricing.js'
import { site } from '../src/data/site.js'

export function buildOrder(rawLines) {
  if (!Array.isArray(rawLines) || rawLines.length === 0) throw new Error('Order is empty')
  const lines = rawLines.map((l) => {
    const product = findProduct(l.productId)
    const variant = findVariant(l.productId, l.variantId)
    const qty = Math.floor(Number(l.qty))
    if (!product || !variant) throw new Error(`Unknown product ${l.productId}/${l.variantId}`)
    if (!Number.isFinite(qty) || qty < 1 || qty > 999) throw new Error(`Bad quantity for ${product.name}`)
    return { productId: l.productId, variantId: l.variantId, qty, product, variant }
  })
  const totals = cartTotals(lines)
  return { lines, totals }
}

const cents = (n) => Math.round(n * 100)

// Stripe Checkout line items, ex GST. If a Stripe tax rate id is supplied it is
// attached to every line and Stripe adds GST. Otherwise GST is added as its own line.
export function buildLineItems({ lines, totals }, taxRateId) {
  const withTax = (item) => (taxRateId ? { ...item, tax_rates: [taxRateId] } : item)
  const items = lines.map((l) =>
    withTax({
      quantity: l.qty,
      price_data: {
        currency: 'aud',
        unit_amount: cents(cartonPrice(l.variant, l.qty)),
        product_data: {
          name: `${l.product.name} · ${l.variant.label}`,
          description: `SKU ${l.variant.sku}. Price per carton ex GST.`,
          metadata: { sku: l.variant.sku, productId: l.productId, variantId: l.variantId },
        },
      },
    }),
  )
  if (totals.delivery > 0) {
    items.push(
      withTax({
        quantity: 1,
        price_data: { currency: 'aud', unit_amount: cents(totals.delivery), product_data: { name: 'Delivery', description: site.deliveryArea } },
      }),
    )
  }
  if (!taxRateId) {
    items.push({
      quantity: 1,
      price_data: { currency: 'aud', unit_amount: cents(totals.gst), product_data: { name: 'GST 10%' } },
    })
  }
  return items
}

export function orderSummaryText({ lines, totals }) {
  return lines
    .map((l) => `${l.qty} x ${l.product.name} (${l.variant.label}) [${l.variant.sku}] @ $${cartonPrice(l.variant, l.qty).toFixed(2)} = $${(cartonPrice(l.variant, l.qty) * l.qty).toFixed(2)}`)
    .join('\n')
    .concat(`\n\nDelivery: ${totals.delivery === 0 ? 'Free' : '$' + totals.delivery.toFixed(2)}`)
}

// Stripe metadata values are capped at 500 characters.
export function clip(s, n = 500) {
  return String(s ?? '').slice(0, n)
}

export function buildMetadata(orderRef, customer, order) {
  const c = customer ?? {}
  return {
    orderRef,
    source: 'hygiene-direct-web',
    businessName: clip(c.businessName),
    abn: clip(c.abn),
    contactName: clip(c.contactName),
    phone: clip(c.phone),
    email: clip(c.email),
    poNumber: clip(c.poNumber),
    deliverTo: clip(`${c.street}, ${c.suburb} ${c.state} ${c.postcode}`),
    deliveryInstructions: clip(c.deliveryInstructions),
    orderSummary: clip(orderSummaryText(order)),
    subtotalExGst: order.totals.exGst.toFixed(2),
    gst: order.totals.gst.toFixed(2),
    totalIncGst: order.totals.total.toFixed(2),
  }
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
