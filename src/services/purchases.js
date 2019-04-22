import { curry, then, pipe } from 'ramda'
import { keyValueListToObject } from 'util/ramda'

import database from 'database'

const { designUpdate, insert, findAll, groupReduce } = database

export const purchaseFields = ['variantId', 'quantity', 'date']

// registerPurchase :: Number -> String -> Promise<Ok>
export const registerPurchase = curry((quantity, variantId) =>
  designUpdate('stock', 'purchase', { quantity }, variantId)
)

// insertPurchase :: Purchase -> Promise<Ok>
export const insertPurchase = purchase => {
  const { quantity, variantId } = purchase

  return pipe(
    purchase =>
      insert({
        ...purchase,
        type: 'purchase',
        date: new Date()
      }),
    then(() => registerPurchase(quantity, variantId))
  )(purchase)
}

// listAllPurchases :: Promise<Purchase[]>
export const listAllPurchases = () =>
  findAll({
    fields: purchaseFields,
    selector: { type: { $eq: 'purchase' } }
  })

// listReducedPurchases :: Promise<Purchase[]>
export const listReducedPurchases = () => groupReduce('stock', 'purchases', {})
