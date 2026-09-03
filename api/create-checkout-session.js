import { createCheckoutSession } from '../server/handlers.js'

export const GET = (req) => createCheckoutSession(req)
export const POST = (req) => createCheckoutSession(req)
