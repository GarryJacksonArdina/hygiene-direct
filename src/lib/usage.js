import { products } from '../data/products'

const WORK_DAYS_PER_MONTH = 22

// Rough monthly consumption estimate for a commercial site.
// Assumptions are deliberately conservative and shown to the user.
export function estimateMonthly({ staff = 0, visitors = 0 }) {
  const people = Number(staff) + Number(visitors) * 0.3 // a visitor uses roughly a third of what a staff member does
  return products.map((p) => {
    const v = p.variants[0]
    let cartons = 0
    if (p.usage.type === 'toilet' || p.usage.type === 'towel') {
      const sheets = people * p.usage.sheetsPerPersonPerDay * WORK_DAYS_PER_MONTH
      cartons = sheets / (v.sheetsPerUnit * v.unitsPerCarton)
    } else if (p.usage.type === 'soap') {
      const ml = people * p.usage.mlPerPersonPerDay * WORK_DAYS_PER_MONTH
      cartons = ml / (v.mlPerUnit * v.unitsPerCarton)
    }
    return { product: p, variant: v, cartons: Math.max(1, Math.ceil(cartons)), raw: cartons }
  })
}
