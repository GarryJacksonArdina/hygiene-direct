# Hygiene Direct

Commercial washroom consumables ordering site for Ardina Commercial Services.
Four products (2 ply toilet paper, 3 ply toilet paper, hand towel, hand soap), carton pricing, volume discounts, usage calculator, one click reorder, and an order form that lands in your inbox.

Stack: React 19, Vite, Tailwind v4, React Router. No backend. Orders and account enquiries are captured with Netlify Forms.

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

## Deploy on Netlify

1. Push this repo to GitHub and create a new Netlify site from it. `netlify.toml` already sets the build command, publish folder and the SPA redirect.
2. In the Netlify dashboard go to Forms. After the first deploy you will see two forms: `order` and `account-enquiry`.
3. Add an email notification on each form (Forms > Form notifications) pointing at the orders inbox. Every submitted order arrives as an email with the order reference, lines, totals and delivery details.
4. Optional: add a Slack or Zapier notification from the same screen if you want orders pushed into ServiceM8 or Ardina JMS later.

Vercel also works (`vercel.json` handles the SPA rewrite) but the forms will need a different backend such as Formspree or a small serverless function.

## Before go live

- [ ] Replace placeholder prices in `src/data/products.js`
- [ ] Set real phone, email and ABN in `src/data/site.js`
- [ ] Confirm delivery fee and free delivery threshold
- [ ] Confirm volume discount tiers make margin
- [ ] Have terms of trade reviewed
- [ ] Swap illustrations for product photos
- [ ] Set up Netlify form notifications and place a test order
- [ ] Point the domain at Netlify
