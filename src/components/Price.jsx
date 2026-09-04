import { useCart } from '../context/CartContext'
import { fmt, incGst } from '../lib/pricing'

// A price that honours the site wide ex GST / inc GST toggle.
export default function Price({ exGst, className = '', suffix = '', size = 'md' }) {
  const { showGst } = useCart()
  const value = showGst ? incGst(exGst) : exGst
  const big = size === 'lg' ? 'text-[34px]' : size === 'sm' ? 'text-[17px]' : 'text-[24px]'
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`num display ${big} leading-none text-ink`}>{fmt(value)}</span>
      <span className="text-[12px] text-ink-3">
        {showGst ? 'inc GST' : 'ex GST'}
        {suffix}
      </span>
    </span>
  )
}
