import { Link } from 'react-router-dom'
import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="mt-24 bg-stage text-[12px] text-ink-2">
      <div className="mx-auto max-w-[1024px] px-5 py-10 sm:px-6">
        <p className="max-w-2xl leading-relaxed">
          {site.name} is the consumables supply arm of {site.parentCompany}. We stock the same tissue, towel and soap on our own cleaning contracts and deliver direct across {site.deliveryArea}.
        </p>
        <div className="mt-6 grid gap-8 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-ink">Order</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link className="hover:underline" to="/#products">The range</Link></li>
              <li><Link className="hover:underline" to="/#calculator">Usage calculator</Link></li>
              <li><Link className="hover:underline" to="/order">Your order</Link></li>
              <li><Link className="hover:underline" to="/account">30 day accounts</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Contact</p>
            <ul className="mt-2 space-y-1.5">
              <li><a className="num hover:underline" href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
              <li><a className="hover:underline" href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>{site.address}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Legal</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link className="hover:underline" to="/terms">Terms of trade</Link></li>
              <li>Prices in AUD. GST shown where indicated.</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 border-t border-line pt-5 text-ink-3">
          &copy; {new Date().getFullYear()} {site.parentEntity} trading as {site.name}. ABN <span className="num">{site.abn}</span>.
        </p>
      </div>
    </footer>
  )
}
