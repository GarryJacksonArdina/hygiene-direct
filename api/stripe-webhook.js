import { stripeWebhook } from '../server/handlers.js'

export const GET = (req) => stripeWebhook(req)
export const POST = (req) => stripeWebhook(req)
