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
    <article className="group flex flex-col overflow-hidden rounded-[28px] bg-stage" id={product.slug}>
      <div className="px-8 pt-9 text-center">
        <p className="eyebrow">{product.category}</p>
        <h3 className="display mt-2 text-[28px] leading-[1.05]">{product.name}</h3>
        <p className="mx-auto mt-2 max-w-[26ch] text-[14px] leading-snug text-ink-2">{product.tagline}</p>
      </div>

      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[300px]">
        <Illustration kind={product.illustration} image={product.image} alt={product.name} className="absolute inset-0 h-full w-full p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
        {inCart && (
          <span className="num absolute right-6 top-4 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">{qty} in order</span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-8 pb-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] text-ink-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-3" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {product.variants.length > 1 ? (
            <>
              <label className="label" htmlFor={`${product.id}-variant`}>Pack size</label>
              <select id={`${product.id}-variant`} className="input !bg-white !py-2.5 !text-[14px]" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
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

        <div className="mt-6 border-t border-line/70 pt-5">
          <Price exGst={unitPrice} suffix=" per carton" />
          <p className="num mt-1.5 text-[12px] text-ink-3">
            {unitMetric(variant, unitPrice)}
            {tier.discount > 0 && <span className="ml-2 font-medium text-brand">{Math.round(tier.discount * 100)}% volume price</span>}
          </p>
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
          <p className="num mt-3 flex h-11 items-center justify-center rounded-full bg-white text-[14px] font-medium text-brand">
            {qty} carton{qty === 1 ? '' : 's'} in your order
          </p>
        ) : (
          <button type="button" className="btn-primary mt-3 w-full" onClick={() => setQty(product.id, variant.id, pendingQty)}>
            Add to order
          </button>
        )}
        {next && (
          <p className="num mt-3 text-center text-[12px] text-ink-3">
            {next.minCartons - shownQty} more unlocks {Math.round(next.discount * 100)}% off this line.
          </p>
        )}
      </div>
    </article>
  )
}
