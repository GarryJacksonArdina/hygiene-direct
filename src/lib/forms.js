// Thin client for the /api routes. Same code runs on Netlify and Vercel.
// In the shareable single file preview there is no server, so calls are simulated.
const MOCK = import.meta.env.VITE_PREVIEW_MOCK === '1'

async function post(path, data) {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    if (path.includes('checkout')) throw new Error('Card payment runs on the live site once Stripe keys are added.')
    return { ok: true, delivered: false, preview: true }
  }
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  let body = {}
  try { body = await res.json() } catch { /* non JSON response */ }
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

export const submitOrder = (payload) => post('/api/order', payload)
export const submitAccountEnquiry = (payload) => post('/api/account-enquiry', payload)
export const createCheckoutSession = (payload) => post('/api/create-checkout-session', payload)

export async function fetchPaymentConfig() {
  if (MOCK) return { card: false, preview: true }
  try {
    const res = await fetch('/api/payment-config')
    if (!res.ok) return { card: false }
    return await res.json()
  } catch {
    return { card: false }
  }
}

export async function fetchCheckoutSession(id) {
  const res = await fetch(`/api/checkout-session?id=${encodeURIComponent(id)}`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not confirm payment')
  return body
}

// The order is stashed here before redirecting to Stripe so the confirmation
// page can show it and save it for reorder once payment is confirmed.
const PENDING_KEY = 'hd-pending-order-v1'
export function savePendingOrder(order) {
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(order)) } catch { /* ignore */ }
}
export function readPendingOrder() {
  try { return JSON.parse(sessionStorage.getItem(PENDING_KEY)) } catch { return null }
}
export function clearPendingOrder() {
  try { sessionStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
}

export function makeOrderRef() {
  const d = new Date()
  const stamp = `${d.getFullYear().toString().slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `HD-${stamp}-${rand}`
}

function pad(n) {
  return n.toString().padStart(2, '0')
}
