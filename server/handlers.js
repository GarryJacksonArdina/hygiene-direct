// All API handlers take a Web Request and return a Web Response, so the same
// code runs on Netlify Functions and Vercel Functions via the thin adapters in
// netlify/functions/ and api/.
import Stripe from 'stripe'
import { buildLineItems, buildMetadata, buildOrder, json, orderSummaryText } from './checkout.js'
import { deliver } from './notify.js'

const cardEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY)

// GET /api/payment-config
export async function paymentConfig() {
  return json({ card: cardEnabled(), testMode: (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') })
}

// POST /api/order  (invoice and account orders)
export async function submitOrder(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  const body = await readJson(req)
  if (!body) return json({ error: 'Invalid request' }, 400)
  const { orderRef, customer = {}, lines, paymentMethod } = body
  if (!orderRef || !customer.email || !customer.businessName) return json({ error: 'Missing order details' }, 400)
  let order
  try {
    order = buildOrder(lines)
  } catch (err) {
    return json({ error: err.message }, 400)
  }
  const delivered = await deliver('order', {
    orderRef,
    ...customerFields(customer),
    paymentMethod: paymentMethod || 'invoice-prepay',
    orderLines: orderSummaryText(order),
    subtotalExGst: order.totals.exGst.toFixed(2),
    gst: order.totals.gst.toFixed(2),
    totalIncGst: order.totals.total.toFixed(2),
  })
  return json({ ok: true, delivered, totals: order.totals })
}

// POST /api/account-enquiry
export async function accountEnquiry(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  const body = await readJson(req)
  if (!body || !body.businessName || !body.email) return json({ error: 'Missing details' }, 400)
  const delivered = await deliver('account-enquiry', {
    businessName: body.businessName,
    contactName: body.contactName ?? '',
    email: body.email,
    phone: body.phone ?? '',
    message: body.message ?? '',
  })
  return json({ ok: true, delivered })
}

// POST /api/create-checkout-session
export async function createCheckoutSession(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  if (!cardEnabled()) return json({ error: 'Card payments are not switched on yet. Choose pay on invoice instead.' }, 503)
  const body = await readJson(req)
  if (!body) return json({ error: 'Invalid request' }, 400)
  const { orderRef, customer = {}, lines } = body
  if (!orderRef || !customer.email || !customer.businessName) return json({ error: 'Missing order details' }, 400)

  let order
  try {
    order = buildOrder(lines)
  } catch (err) {
    return json({ error: err.message }, 400)
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const origin = siteOrigin(req)
  const metadata = buildMetadata(orderRef, customer, order)
  const description = `Hygiene Direct order ${orderRef}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      currency: 'aud',
      customer_email: customer.email,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      line_items: buildLineItems(order, process.env.STRIPE_GST_TAX_RATE_ID || undefined),
      client_reference_id: orderRef,
      metadata,
      payment_intent_data: { description, metadata },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description,
          metadata,
          footer: `${metadata.businessName}. Deliver to ${metadata.deliverTo}.`,
          ...(customer.poNumber ? { custom_fields: [{ name: 'PO number', value: String(customer.poNumber).slice(0, 140) }] } : {}),
        },
      },
      success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order?cancelled=1`,
    })
    return json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('Stripe session error', err)
    return json({ error: 'Could not start card payment. Please try again or choose pay on invoice.' }, 502)
  }
}

// GET /api/checkout-session?id=cs_...
export async function checkoutSession(req) {
  if (!cardEnabled()) return json({ error: 'Not configured' }, 503)
  const id = new URL(req.url).searchParams.get('id')
  if (!id || !id.startsWith('cs_')) return json({ error: 'Missing session id' }, 400)
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const s = await stripe.checkout.sessions.retrieve(id, { expand: ['payment_intent'] })
    return json({
      paid: s.payment_status === 'paid',
      status: s.payment_status,
      orderRef: s.metadata?.orderRef ?? s.client_reference_id,
      email: s.customer_details?.email ?? s.customer_email,
      amountTotal: (s.amount_total ?? 0) / 100,
      paymentRef: typeof s.payment_intent === 'object' ? s.payment_intent?.id : s.payment_intent,
    })
  } catch (err) {
    console.error('Stripe retrieve error', err)
    return json({ error: 'Could not confirm payment' }, 502)
  }
}

// POST /api/stripe-webhook
// Stripe calls this when a Checkout payment completes. The paid order is sent
// through the same notification channels as invoice orders. This is also the
// hook point for Xero once that integration is ready.
export async function stripeWebhook(req) {
  const secret = process.env.STRIPE_SECRET_KEY
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !whSecret) return json({ error: 'Webhook not configured' }, 503)

  const stripe = new Stripe(secret)
  const sig = req.headers.get('stripe-signature')
  const raw = await req.text()

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, whSecret)
  } catch (err) {
    console.error('Webhook signature failed', err.message)
    return json({ error: 'Bad signature' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    const m = s.metadata ?? {}
    if (s.payment_status === 'paid') {
      const paymentRef = typeof s.payment_intent === 'string' ? s.payment_intent : s.id
      await deliver('order', {
        orderRef: m.orderRef ?? s.client_reference_id ?? '',
        businessName: m.businessName ?? '',
        abn: m.abn ?? '',
        contactName: m.contactName ?? '',
        email: m.email ?? s.customer_details?.email ?? '',
        phone: m.phone ?? '',
        street: m.deliverTo ?? '',
        suburb: '',
        state: '',
        postcode: '',
        poNumber: m.poNumber ?? '',
        deliveryInstructions: m.deliveryInstructions ?? '',
        paymentMethod: `card-paid (Stripe ${paymentRef})`,
        orderLines: m.orderSummary ?? '',
        subtotalExGst: m.subtotalExGst ?? '',
        gst: m.gst ?? '',
        totalIncGst: m.totalIncGst ?? ((s.amount_total ?? 0) / 100).toFixed(2),
      })
      // TODO Xero: create an ACCREC invoice marked paid (or a sales receipt)
      // from the metadata above, using paymentRef as the payment reference.
    }
  }
  return json({ received: true })
}

// helpers
async function readJson(req) {
  try {
    return await req.json()
  } catch {
    return null
  }
}

function siteOrigin(req) {
  const origin = req.headers.get('origin')
  if (origin) return origin
  if (process.env.URL) return process.env.URL // Netlify
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:8888'
}

function customerFields(c) {
  return {
    businessName: c.businessName ?? '',
    abn: c.abn ?? '',
    contactName: c.contactName ?? '',
    email: c.email ?? '',
    phone: c.phone ?? '',
    street: c.street ?? '',
    suburb: c.suburb ?? '',
    state: c.state ?? '',
    postcode: c.postcode ?? '',
    poNumber: c.poNumber ?? '',
    deliveryInstructions: c.deliveryInstructions ?? '',
  }
}
