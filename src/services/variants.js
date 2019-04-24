import { curry, pipe, then, prop, add, converge } from 'ramda'
import { registerEmptyStock } from './stock'
import database from 'database'

const { get, insert, update, findOne } = database

export const variantFields = [
  'productId',
  'stock',
  'name',
  'disabled',
  'createdAt',
  'updatedAt',
  'quantity',
  'purchased',
  'soldOutIn'
]

// getQuantity :: Variant -> Number
export const getQuantity = prop('quantity')

// getPurchased :: Variant -> Number
export const getPurchased = prop('purchased')

// getVariant :: String -> Promise<Variant>
export const getVariant = id =>
  findOne(id, {
    fields: variantFields,
    selector: { type: { $eq: 'variant' } }
  })

// getVariantStock :: String -> Number
export const getVariantStock = id =>
  pipe(
    getVariant,
    then(getQuantity)
  )(id)

// getVariantStockWithPurchased :: String -> Number
export const getVariantStockWithPurchased = id =>
  pipe(
    getVariant,
    then(converge(add, [getPurchased, getQuantity]))
  )(id)

// insertVariant :: Variant -> Promise<Ok>
export const insertVariant = variant =>
  pipe(
    variant =>
      insert({
        ...variant,
        type: 'variant',
        purchased: 0,
        createdAt: new Date()
      }),
    then(({ id }) => registerEmptyStock(id))
  )(variant)

// updateVariant :: String -> Variant -> Promise<Nano.DatabaseUpdateResponse>
export const updateVariant = curry((id, variant) =>
  pipe(
    get,
    then(oldVariant => {
      const { rev } = oldVariant
      return update(
        {
          ...oldVariant,
          ...variant,
          updatedAt: new Date()
        },
        id,
        rev
      )
    })
  )(id)
)

// destroyVariant :: String -> Promise<Nano.DatabaseUpdateResponse>
export const destroyVariant = id =>
  pipe(
    get,
    then(variant => {
      const { rev } = variant
      return update({ ...variant, disabled: true }, id, rev)
    })
  )(id)
