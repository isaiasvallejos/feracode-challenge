import database from 'database'

const { designUpdate } = database

// registerStock :: Stock -> Promise<Ok>
export const registerStock = ({ quantity, variantId }) =>
  designUpdate('stock', 'register', { quantity }, variantId)

// registerEmptyStock :: String -> Promise<Ok>
export const registerEmptyStock = variantId =>
  registerStock({ quantity: 0, variantId })
