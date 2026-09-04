import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fmt } from '../lib/pricing'
import Logo from './Logo'

export default function Header() {
  const { cartonCount, totals, showGst, setShowGst } = useCart()
  const { pathname } = useLocation()
  const onOrderPage = pathname === '/order'

  return (
    <header className="sticky top-0 z-40 bg-ink/85 text-white backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between gap-6 px-5 sm:px-6">
        <Link to="/" aria-label="Hygiene Direct home" className="shrink-0">
          <Logo light className="!text-[17px]" />
        </Link>

        <nav className="hidden items-center gap-7 text-[12px] font-normal text-white/80 md:flex" aria-label="Main">
          <Link to="/#products" className="transition-colors hover:text-white">Range</Link>
          <Link to="/#calculator" className="transition-colors hover:text-white">Calculator</Link>
          <Link to="/#how-it-works" className="transition-colors hover:text-white">How it works</Link>
          <Link to="/account" className="transition-colors hover:text-white">Accounts</Link>
          <Link to="/#faq" className="transition-colors hover:text-white">Support</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowGst(!showGst)}
            className="hidden text-[12px] text-white/60 transition-colors hover:text-white sm:inline"
            aria-pressed={showGst}
            title="Toggle prices between ex GST and inc GST"
          >
            {showGst ? 'inc GST' : 'ex GST'}
          </button>
          <NavLink to="/order" className={`num inline-flex h-8 items-center gap-2 rounded-full bg-white px-3.5 text-[12px] font-medium text-ink transition-colors hover:bg-stage ${onOrderPage ? 'pointer-events-none' : ''}`}>
            <BagIcon />
            {cartonCount > 0 ? `${cartonCount} · ${fmt(totals.subtotal)}` : 'Order'}
          </NavLink>
        </div>
      </div>
    </header>
  )
}

function BagIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8h12l1 13H5z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}
