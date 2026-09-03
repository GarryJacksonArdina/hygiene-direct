import { Link } from 'react-router-dom'
import { site } from '../data/site'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">
            The consumables supply arm of {site.parentCompany}. The same tissue, towel and soap we stock on our own cleaning contracts, delivered direct across {site.deliveryArea}.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <p className="eyebrow">Order</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-ink-2">
            <li><Link className="transition-colors hover:text-ink" to="/#products">The range</Link></li>
            <li><Link className="transition-colors hover:text-ink" to="/#calculator">Usage calculator</Link></li>
            <li><Link className="transition-colors hover:text-ink" to="/order">Your order</Link></li>
            <li><Link className="transition-colors hover:text-ink" to="/account">30 day accounts</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-ink-2">
            <li><a className="num transition-colors hover:text-ink" href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
            <li><a className="transition-colors hover:text-ink" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{site.address}</li>
            <li><Link className="transition-colors hover:text-ink" to="/terms">Terms of trade</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-5 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>&copy; {new Date().getFullYear()} {site.parentEntity} trading as {site.name}. ABN <span className="num">{site.abn}</span>.</span>
          <span>Prices in AUD. GST shown where indicated.</span>
        </div>
      </div>
    </footer>
  )
}
