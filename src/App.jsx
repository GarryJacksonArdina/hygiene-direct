import { useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { CartProvider } from './context/CartContext'
import Account from './pages/Account'
import Confirmed from './pages/Confirmed'
import Home from './pages/Home'
import Order from './pages/Order'
import Terms from './pages/Terms'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash || (pathname.length > 1 ? '#' + pathname.slice(1) : '')
    if (target) {
      const el = document.getElementById(target.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// The shareable single file preview uses hash routing because it has no server.
const Router = import.meta.env.VITE_PREVIEW_MOCK ? HashRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollManager />
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order-confirmed" element={<Confirmed />} />
              <Route path="/account" element={<Account />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  )
}
