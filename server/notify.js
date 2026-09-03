// Delivers an order or enquiry to wherever the business wants it.
// Host agnostic. Tries, in parallel: Netlify Forms (when running on Netlify),
// a generic webhook (Zapier, Make, Slack, Ardina JMS), and Resend email.
// Returns true if at least one channel accepted it.

export async function deliver(formName, fields) {
  const results = await Promise.all([viaNetlifyForms(formName, fields), viaWebhook(formName, fields), viaResend(formName, fields)])
  const delivered = results.some(Boolean)
  if (!delivered) console.log(`[${formName}] no notification channel configured. Payload:`, JSON.stringify(fields))
  return delivered
}

async function viaNetlifyForms(formName, fields) {
  if (process.env.NETLIFY !== 'true' || !process.env.URL) return false
  try {
    const body = new URLSearchParams({ 'form-name': formName, ...stringify(fields) }).toString()
    const res = await fetch(`${process.env.URL}/`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (!res.ok) console.error('Netlify Forms forward failed', res.status)
    return res.ok
  } catch (err) {
    console.error('Netlify Forms forward error', err)
    return false
  }
}

async function viaWebhook(formName, fields) {
  const url = process.env.ORDER_WEBHOOK_URL
  if (!url) return false
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: formName, ...fields }) })
    if (!res.ok) console.error('Webhook forward failed', res.status)
    return res.ok
  } catch (err) {
    console.error('Webhook forward error', err)
    return false
  }
}

async function viaResend(formName, fields) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.ORDER_EMAIL_TO
  if (!key || !to) return false
  const from = process.env.ORDER_EMAIL_FROM || 'Hygiene Direct <onboarding@resend.dev>'
  const subject =
    formName === 'order'
      ? `New order ${fields.orderRef} from ${fields.businessName} · $${fields.totalIncGst} inc GST (${fields.paymentMethod})`
      : `Account enquiry from ${fields.businessName}`
  const text = Object.entries(stringify(fields)).map(([k, v]) => `${k}: ${v}`).join('\n')
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()), reply_to: fields.email || undefined, subject, text }),
    })
    if (!res.ok) console.error('Resend failed', res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error('Resend error', err)
    return false
  }
}

function stringify(fields) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v == null ? '' : String(v)]))
}
