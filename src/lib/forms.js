// Posts a Netlify Forms compatible payload. Works once deployed on Netlify.
// In local dev the request will not be handled, so callers should surface a fallback.
export async function submitNetlifyForm(formName, data) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Form submission failed with status ${res.status}`)
  return res
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
