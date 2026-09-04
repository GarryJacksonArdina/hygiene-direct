// ---------------------------------------------------------------------------
// Product catalogue. Prices are per carton, ex GST, in AUD.
// PLACEHOLDER PRICING. Replace with real supplier cost + margin before launch.
//
// Photos: drop a PNG with a transparent or white background into public/products/
// and set `image: '/products/2-ply.png'` on the product. Square, at least 1200px.
// Until then the tonal illustration is shown.
// ---------------------------------------------------------------------------
export const products = [
  {
    id: 'tp-2ply',
    slug: '2-ply-toilet-paper',
    name: '2 Ply Toilet Paper',
    shortName: '2 Ply Toilet Paper',
    category: 'Toilet Paper',
    illustration: 'roll',
    image: null, // e.g. '/products/2-ply.png'
    tagline: 'The everyday workhorse for busy washrooms.',
    description:
      'Soft, strong 2 ply virgin tissue in a standard 400 sheet roll. Fits all standard single and jumbo style dispensers that take conventional rolls. Individually wrapped for hygiene.',
    features: ['400 sheets per roll', 'Fits standard dispensers', 'Individually wrapped', 'FSC certified paper'],
    variants: [
      {
        id: 'tp-2ply-48',
        label: 'Carton of 48 rolls',
        unitsPerCarton: 48,
        unitLabel: 'rolls',
        sheetsPerUnit: 400,
        priceExGst: 42.0,
        sku: 'HD-TP2-48',
      },
    ],
    usage: { type: 'toilet', sheetsPerPersonPerDay: 25 },
  },
  {
    id: 'tp-3ply',
    slug: '3-ply-toilet-paper',
    name: '3 Ply Toilet Paper',
    shortName: '3 Ply Toilet Paper',
    category: 'Toilet Paper',
    illustration: 'roll',
    premium: true,
    tagline: 'Premium softness for offices, clinics and client facing sites.',
    description:
      'Thick, quilted 3 ply tissue in a 250 sheet roll. The choice for medical, professional services and hospitality sites where comfort is noticed. Individually wrapped.',
    features: ['250 sheets per roll', 'Quilted 3 ply softness', 'Fits standard dispensers', 'Individually wrapped'],
    variants: [
      {
        id: 'tp-3ply-48',
        label: 'Carton of 48 rolls',
        unitsPerCarton: 48,
        unitLabel: 'rolls',
        sheetsPerUnit: 250,
        priceExGst: 52.0,
        sku: 'HD-TP3-48',
      },
    ],
    usage: { type: 'toilet', sheetsPerPersonPerDay: 20 },
  },
  {
    id: 'hand-towel',
    slug: 'hand-towel',
    name: 'Interleaved Hand Towel',
    shortName: 'Hand Towel',
    category: 'Hand Towel',
    illustration: 'towel',
    tagline: 'One sheet at a time. Less waste, less mess.',
    description:
      'Interleaved paper hand towel that dispenses one sheet at a time to cut waste. Strong when wet and fast absorbing. Fits standard interleaved towel dispensers.',
    features: ['Single sheet dispensing', 'Strong when wet', 'Fits standard dispensers', 'Recycled fibre option'],
    variants: [
      {
        id: 'ht-slim-16',
        label: 'Slimline 23 x 23cm, carton of 16 packs (3,200 sheets)',
        shortLabel: 'Slimline 3,200 sheets',
        unitsPerCarton: 16,
        unitLabel: 'packs',
        sheetsPerUnit: 200,
        priceExGst: 38.0,
        sku: 'HD-HT-SL-16',
      },
      {
        id: 'ht-ultra-20',
        label: 'Ultraslim 24 x 24cm, carton of 20 packs (3,000 sheets)',
        shortLabel: 'Ultraslim 3,000 sheets',
        unitsPerCarton: 20,
        unitLabel: 'packs',
        sheetsPerUnit: 150,
        priceExGst: 44.0,
        sku: 'HD-HT-UL-20',
      },
    ],
    usage: { type: 'towel', sheetsPerPersonPerDay: 6 },
  },
  {
    id: 'hand-soap',
    slug: 'hand-soap',
    name: 'Hand Soap',
    shortName: 'Hand Soap',
    category: 'Soap',
    illustration: 'soap',
    tagline: 'Gentle on hands, tough on grime. Bulk sizes that last.',
    description:
      'Mild, pH balanced liquid hand soap with a light clean fragrance. Suitable for bulk fill and cartridge dispensers. Australian made.',
    features: ['pH balanced, mild formula', 'Light clean fragrance', 'Bulk fill or cartridge', 'Australian made'],
    variants: [
      {
        id: 'soap-5l-2',
        label: '5L bulk refill, carton of 2 (10L)',
        shortLabel: '2 x 5L bulk refill',
        unitsPerCarton: 2,
        unitLabel: 'bottles',
        mlPerUnit: 5000,
        priceExGst: 48.0,
        sku: 'HD-SP-5L-2',
      },
      {
        id: 'soap-1l-6',
        label: '1L cartridge, carton of 6 (6L)',
        shortLabel: '6 x 1L cartridge',
        unitsPerCarton: 6,
        unitLabel: 'cartridges',
        mlPerUnit: 1000,
        priceExGst: 54.0,
        sku: 'HD-SP-1L-6',
      },
    ],
    usage: { type: 'soap', mlPerPersonPerDay: 3 },
  },
]

export function findProduct(productId) {
  return products.find((p) => p.id === productId)
}

export function findVariant(productId, variantId) {
  const p = findProduct(productId)
  return p ? p.variants.find((v) => v.id === variantId) : undefined
}
