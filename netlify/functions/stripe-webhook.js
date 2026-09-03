import { stripeWebhook } from '../../server/handlers.js'

export default (req) => stripeWebhook(req)
