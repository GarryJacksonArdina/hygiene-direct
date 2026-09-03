import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { cartonPrice, fmt, nextTier, tierFor } from '../lib/pricing'
import Illustration from './Illustration'
import Price from './Price'
import QtyStepper from './QtyStepper'

export default function ProductCard({ product }) {
  const { qtyOf, setQty } = useCart()
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const variant = product.variants.find((v) => v.id === variantId)
  const qty = qtyOf(product.id, variant.id)
  const [pendingQty, setPendingQty] = useState(1)
  const [flash, setFlash] = useState(false)

  const inCart = qty > 0
  const shownQty = inCart ? qty : pendingQty
  const unitPrice = cartonPrice(variant, shownQty)
  const tier = tierFor(shownQty)
  const next = nextTier(shownQty)
  const perUnit = unitPrice / variant.unitsPerCarton

  function addToOrder() {
    setQty(product.id, variant.id, pendingQty)
    setFlash(true)
    setTimeout(() => setFlash(false), 900)
  }

  return (
    <article className="card flex flex-col overflow-hidden" id={product.slug}>
      <div className="relative bg-gradient-to-b from-ink-100 to-white p-6">
        {product.premium && <span className="chip absolute left-4 top-4 bg-amber-100 text-amber-800">Premium</span>}
        {inCart && <span className="chip absolute right-4 top-4 bg-brand-100 text-brand-800">{qty} in order</span>}
        <Illustration kind={product.illustration} className="mx-auto h-40 w-full" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">{product.category}</p>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-ink-500">{product.tagline}</p>

        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-ink-700">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <Tick />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {product.variants.length > 1 ? (
          <div className="mt-5">
            <label className="label" htmlFor={`${product.id}-variant`}>Pack size</label>
            <select
              id={`${product.id}-variant`}
              className="input"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>{v.label} · {fmt(v.priceExGst)} ex GST</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-5 text-sm font-semibold text-ink-700">{variant.label}</p>
        )}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <Price exGst={unitPrice} suffix=" / carton" />
            <p className="mt-0.5 text-xs text-ink-500">
              {fmt(perUnit)} per {variant.unitLabel.replace(/s$/, '')} ex GST
              {tier.discount > 0 && <span className="ml-1 font-semibold text-brand-700">· {Math.round(tier.discount * 100)}% volume discount applied</span>}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <QtyStepper
            value={shownQty}
            min={inCart ? 0 : 1}
            onChange={(n) => (inCart ? setQty(product.id, variant.id, n) : setPendingQty(n))}
          />
          {inCart ? (
            <span className={`text-sm font-semibold ${flash ? 'text-brand-700' : 'text-ink-700'}`}>
              {flash ? 'Added' : `${qty} carton${qty === 1 ? '' : 's'} in your order`}
            </span>
          ) : (
            <button type="button" className="btn-primary flex-1" onClick={addToOrder}>
              Add to order
            </button>
          )}
        </div>

        {next && (
          <p className="mt-3 text-xs text-ink-500">
            Order {next.minCartons - shownQty} more carton{next.minCartons - shownQty === 1 ? '' : 's'} for {Math.round(next.discount * 100)}% off this line.
          </p>
        )}
      </div>
    </article>
  )
}

function Tick() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4L8.5 12l6.8-6.7a1 1 0 0 1 1.4 0z" clipRule="evenodd" />
    </svg>
  )
}
