import { site } from '../data/site'

export function fmt(n) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n)
}

export function tierFor(cartons) {
  let tier = site.volumeTiers[0]
  for (const t of site.volumeTiers) if (cartons >= t.minCartons) tier = t
  return tier
}

export function nextTier(cartons) {
  return site.volumeTiers.find((t) => t.minCartons > cartons)
}

// Price per carton after volume discount, ex GST.
export function cartonPrice(variant, cartons) {
  const tier = tierFor(cartons)
  return round2(variant.priceExGst * (1 - tier.discount))
}

export function incGst(exGst) {
  return round2(exGst * (1 + site.gstRate))
}

export function round2(n) {
  return Math.round(n * 100) / 100
}

export function cartTotals(lines) {
  const subtotal = round2(lines.reduce((sum, l) => sum + cartonPrice(l.variant, l.qty) * l.qty, 0))
  const delivery = subtotal === 0 || subtotal >= site.freeDeliveryThresholdExGst ? 0 : site.deliveryFeeExGst
  const exGst = round2(subtotal + delivery)
  const gst = round2(exGst * site.gstRate)
  const total = round2(exGst + gst)
  const savings = round2(lines.reduce((sum, l) => sum + (l.variant.priceExGst - cartonPrice(l.variant, l.qty)) * l.qty, 0))
  return { subtotal, delivery, exGst, gst, total, savings }
}
