import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fmt } from '../lib/pricing'
import Logo from './Logo'

export default function Header() {
  const { cartonCount, totals, showGst, setShowGst } = useCart()
  const { pathname } = useLocation()
  const onOrderPage = pathname === '/order'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" aria-label="Hygiene Direct home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-ink-2 md:flex" aria-label="Main">
          <Link to="/#products" className="transition-colors hover:text-ink">Range</Link>
          <Link to="/#calculator" className="transition-colors hover:text-ink">Calculator</Link>
          <Link to="/#how-it-works" className="transition-colors hover:text-ink">How it works</Link>
          <Link to="/account" className="transition-colors hover:text-ink">Accounts</Link>
          <Link to="/#faq" className="transition-colors hover:text-ink">Questions</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGst(!showGst)}
            className="hidden text-[12px] font-medium text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors hover:text-ink sm:inline"
            aria-pressed={showGst}
            title="Toggle prices between ex GST and inc GST"
          >
            Showing {showGst ? 'inc' : 'ex'} GST
          </button>
          <NavLink to="/order" className={`btn-primary !px-5 !py-2.5 ${onOrderPage ? 'pointer-events-none' : ''}`}>
            <span className="num">{cartonCount > 0 ? `${cartonCount} carton${cartonCount === 1 ? '' : 's'}` : 'Your order'}</span>
            {cartonCount > 0 && <span className="num hidden text-paper/60 sm:inline">{fmt(totals.subtotal)}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  )
}
