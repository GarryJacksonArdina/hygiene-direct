# Hygiene Direct

Commercial washroom consumables ordering site for Ardina Commercial Services.
Four products (2 ply toilet paper, 3 ply toilet paper, hand towel, hand soap), carton pricing, volume discounts, usage calculator, one click reorder, and an order form that lands in your inbox.

Stack: React 19, Vite, Tailwind v4, React Router. A handful of serverless functions in `server/` handle card payments (Stripe Checkout) and order notifications. The same functions run on Netlify (`netlify/functions/`) or Vercel (`api/`).

## Run it locally

```
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`).

## Where to change things

| What | File |
|---|---|
| Prices, pack sizes, SKUs, product copy | `src/data/products.js` |
| Phone, email, ABN, delivery area, free delivery threshold, delivery fee, volume discount tiers | `src/data/site.js` |
| Usage calculator assumptions | `src/lib/usage.js` and the `usage` block on each product |
| Terms of trade | `src/pages/Terms.jsx` |
| FAQ and homepage copy | `src/pages/Home.jsx` |
| Product illustrations | `src/components/Illustration.jsx` (replace with `<img>` tags pointing at photos in `public/` once you have them) |

Prices in `products.js` are per carton, ex GST. GST is calculated at checkout and on the price toggle in the header.

## How orders and payments work

Three payment options at checkout:

| Option | What happens |
|---|---|
| Pay by card now | Browser is sent to Stripe Checkout. Prices are recalculated server side from `products.js`, so the cart cannot be tampered with. Stripe emails a tax receipt. On return the site confirms the session was paid, then the Stripe webhook forwards the order to your notifications. |
| Pay on invoice | Order is posted to `/api/order` and forwarded to your notification channels. You invoice from Xero manually for now. |
| 30 day account | Same as invoice, flagged as an account order. |

The card option is hidden automatically until `STRIPE_SECRET_KEY` is set.

### Environment variables

See `.env.example`. Set these in Netlify (Site configuration > Environment variables) or Vercel (Project > Settings > Environment Variables).

| Variable | Needed for |
|---|---|
| `STRIPE_SECRET_KEY` | Card payments. Use `sk_test_...` first. The checkout page shows a test card hint while in test mode. |
| `STRIPE_WEBHOOK_SECRET` | Forwarding paid card orders to your notifications. Create a webhook in Stripe > Developers > Webhooks pointing at `https://your-domain/api/stripe-webhook` for the event `checkout.session.completed`. |
| `STRIPE_GST_TAX_RATE_ID` | Optional. Create a 10% exclusive tax rate in Stripe and paste its id so GST shows as tax on the Stripe receipt. Without it GST is a line item. |
| `ORDER_WEBHOOK_URL` | Optional. Any JSON webhook (Zapier, Make, Slack, Ardina JMS). |
| `RESEND_API_KEY` + `ORDER_EMAIL_TO` | Optional. Emails every order and enquiry through resend.com. `ORDER_EMAIL_FROM` once you verify a domain there. |

On Netlify no notification variables are needed: orders are also written to Netlify Forms (`order` and `account-enquiry`), and you add email notifications in the Netlify dashboard under Forms. On Vercel set at least one of the webhook or Resend options, otherwise orders are only logged and the confirmation page says so.

### Xero

Not connected yet. The hook point is the `checkout.session.completed` branch in `server/handlers.js`, which already has the customer, order lines, totals and Stripe payment reference in hand. A future step creates a paid ACCREC invoice there and, for invoice orders, a draft invoice from `submitOrder`.

## Deploy

**Netlify:** create a site from this repo. `netlify.toml` sets the build, functions folder and redirects. Local dev with functions: `npx netlify dev`.

**Vercel:** import the repo or deploy the folder. `vercel.json` handles the SPA rewrite and `api/` is picked up automatically. Local dev with functions: `npx vercel dev`.

Test cards in Stripe test mode: 4242 4242 4242 4242, any future expiry, any CVC.

## Before go live

- [ ] Replace placeholder prices in `src/data/products.js`
- [ ] Set real phone, email and ABN in `src/data/site.js`
- [ ] Confirm delivery fee and free delivery threshold
- [ ] Confirm volume discount tiers make margin
- [ ] Have terms of trade reviewed
- [ ] Swap illustrations for product photos
- [ ] Add Stripe test keys, place a test card order, then switch to live keys
- [ ] Set up the Stripe webhook and at least one notification channel, place a test order on each payment option
- [ ] Point the domain at the host
