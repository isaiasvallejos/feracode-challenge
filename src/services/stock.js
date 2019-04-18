import { curry } from 'ramda'
import database from 'database'

const { designUpdate } = database

// registerStock :: Number -> String -> Promise<Ok>
export const registerStock = curry((quantity, variantId) =>
  designUpdate('stock', 'register', { quantity }, variantId)
)

// registerEmptyStock :: String -> Promise<Ok>
export const registerEmptyStock = registerStock(0)
