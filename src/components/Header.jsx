import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fmt } from '../lib/pricing'
import Logo from './Logo'

export default function Header() {
  const { cartonCount, totals, showGst, setShowGst } = useCart()
  const { pathname } = useLocation()
  const onOrderPage = pathname === '/order'

  return (
    <header className="sticky top-0 z-40 border-b border-ink-300/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Hygiene Direct home">
          <Logo className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight text-ink-900">
            Hygiene<span className="text-brand-700">Direct</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink-700 md:flex" aria-label="Main">
          <Link to="/#products" className="hover:text-brand-700">Products</Link>
          <Link to="/#calculator" className="hover:text-brand-700">How much do I need?</Link>
          <Link to="/#how-it-works" className="hover:text-brand-700">How it works</Link>
          <Link to="/#faq" className="hover:text-brand-700">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowGst(!showGst)}
            className="hidden rounded-full border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 sm:inline-flex"
            aria-pressed={showGst}
            title="Toggle prices between ex GST and inc GST"
          >
            Prices {showGst ? 'inc' : 'ex'} GST
          </button>
          <NavLink
            to="/order"
            className={`btn-primary !px-4 !py-2.5 ${onOrderPage ? 'pointer-events-none opacity-90' : ''}`}
          >
            <CartIcon />
            <span>{cartonCount > 0 ? `${cartonCount} ctn` : 'Order'}</span>
            {cartonCount > 0 && <span className="hidden text-white/80 sm:inline">&middot; {fmt(totals.subtotal)}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </svg>
  )
}
