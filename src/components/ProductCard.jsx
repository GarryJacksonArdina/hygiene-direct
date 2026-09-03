import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { cartonPrice, fmt, nextTier, tierFor } from '../lib/pricing'
import Illustration from './Illustration'
import Price from './Price'
import QtyStepper from './QtyStepper'

// The comparison line procurement people actually use.
function unitMetric(variant, price) {
  if (variant.sheetsPerUnit) {
    const sheets = variant.sheetsPerUnit * variant.unitsPerCarton
    return `${fmt((price / sheets) * 1000)} per 1,000 sheets`
  }
  if (variant.mlPerUnit) {
    const litres = (variant.mlPerUnit * variant.unitsPerCarton) / 1000
    return `${fmt(price / litres)} per litre`
  }
  return ''
}

export default function ProductCard({ product }) {
  const { qtyOf, setQty } = useCart()
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const variant = product.variants.find((v) => v.id === variantId)
  const qty = qtyOf(product.id, variant.id)
  const [pendingQty, setPendingQty] = useState(1)

  const inCart = qty > 0
  const shownQty = inCart ? qty : pendingQty
  const unitPrice = cartonPrice(variant, shownQty)
  const tier = tierFor(shownQty)
  const next = nextTier(shownQty)

  return (
    <article className="group flex flex-col bg-surface" id={product.slug}>
      <div className="relative aspect-[5/4] overflow-hidden bg-stage">
        <Illustration kind={product.illustration} className="absolute inset-0 h-full w-full p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none" />
        <div className="absolute left-5 top-5 flex gap-2">
          {product.premium && <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">Premium</span>}
        </div>
        {inCart && (
          <span className="num absolute right-5 top-5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-paper">
            {qty} in order
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
        <p className="eyebrow">{product.category}</p>
        <h3 className="display mt-2 text-[28px] leading-[1.05]">{product.name}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{product.tagline}</p>

        <ul className="mt-5 space-y-1.5 border-t border-line pt-5 text-[13px] text-ink-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <span className="h-px w-3 bg-line-2" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          {product.variants.length > 1 ? (
            <>
              <label className="label" htmlFor={`${product.id}-variant`}>Pack size</label>
              <select id={`${product.id}-variant`} className="input !py-2.5 text-[14px]" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>{v.shortLabel ?? v.label}</option>
                ))}
              </select>
              <p className="mt-2 text-[12px] text-ink-3">{variant.label}</p>
            </>
          ) : (
            <p className="text-[13px] font-medium text-ink">{variant.label}</p>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <Price exGst={unitPrice} suffix=" per carton" />
            <p className="num mt-1.5 text-[12px] text-ink-3">
              {unitMetric(variant, unitPrice)}
              {tier.discount > 0 && <span className="ml-2 font-semibold text-brand">{Math.round(tier.discount * 100)}% volume price</span>}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <QtyStepper
            value={shownQty}
            min={inCart ? 0 : 1}
            onChange={(n) => (inCart ? setQty(product.id, variant.id, n) : setPendingQty(n))}
          />
          <span className="num text-[12px] text-ink-3">carton{shownQty === 1 ? '' : 's'}</span>
        </div>
        {inCart ? (
          <p className="num mt-3 flex h-11 items-center justify-center rounded-full border border-brand-soft bg-brand-tint text-[13px] font-medium text-brand">
            {qty} carton{qty === 1 ? '' : 's'} in your order
          </p>
        ) : (
          <button type="button" className="btn-primary mt-3 w-full" onClick={() => setQty(product.id, variant.id, pendingQty)}>
            Add to order
          </button>
        )}

        {next && (
          <p className="num mt-3 text-[12px] text-ink-3">
            {next.minCartons - shownQty} more carton{next.minCartons - shownQty === 1 ? '' : 's'} unlocks {Math.round(next.discount * 100)}% off this line.
          </p>
        )}
      </div>
    </article>
  )
}
