import { Link } from 'react-router-dom'
import { site } from '../data/site'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-300/60 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-extrabold tracking-tight">Hygiene<span className="text-brand-700">Direct</span></span>
          </div>
          <p className="mt-3 max-w-md text-sm text-ink-500">
            {site.name} is the consumables supply arm of {site.parentCompany}. We supply the same toilet paper, hand towel and soap we use on our own cleaning contracts, delivered direct to your business across {site.deliveryArea}.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">Order</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link className="hover:text-brand-700" to="/#products">Products</Link></li>
            <li><Link className="hover:text-brand-700" to="/#calculator">Usage calculator</Link></li>
            <li><Link className="hover:text-brand-700" to="/order">Your order</Link></li>
            <li><Link className="hover:text-brand-700" to="/account">Open a 30 day account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><a className="hover:text-brand-700" href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
            <li><a className="hover:text-brand-700" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{site.address}</li>
            <li><Link className="hover:text-brand-700" to="/terms">Terms of trade</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-300/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>&copy; {new Date().getFullYear()} {site.parentEntity} trading as {site.name}. ABN {site.abn}.</span>
          <span>All prices in AUD. GST shown where indicated.</span>
        </div>
      </div>
    </footer>
  )
}
