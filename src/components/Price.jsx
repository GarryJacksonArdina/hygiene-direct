import { useCart } from '../context/CartContext'
import { fmt, incGst } from '../lib/pricing'

// Shows a price honouring the site wide ex GST / inc GST toggle.
export default function Price({ exGst, className = '', suffix = '', size = 'md' }) {
  const { showGst } = useCart()
  const value = showGst ? incGst(exGst) : exGst
  const big = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-2xl'
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={`${big} font-extrabold tracking-tight text-ink-900`}>{fmt(value)}</span>
      <span className="text-xs font-medium text-ink-500">
        {showGst ? 'inc GST' : 'ex GST'}
        {suffix}
      </span>
    </span>
  )
}
