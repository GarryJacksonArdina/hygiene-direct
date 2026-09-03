import { submitOrder } from '../server/handlers.js'

export const GET = (req) => submitOrder(req)
export const POST = (req) => submitOrder(req)
