import { curry } from 'ramda'
import database from 'database'

const { get, insert, update, findOne, findAll } = database

export const variantFields = [
  'productId',
  'name',
  'disabled',
  'createdAt',
  'updatedAt'
]

// getVariant :: Integer -> Promise<Variant>
export const getVariant = id =>
  findOne(id, {
    fields: variantFields,
    selector: { type: { $eq: 'variant' } }
  })

// insertVariant :: Integer -> Promise<Error, Ok>
export const insertVariant = variant =>
  insert({
    ...variant,
    type: 'variant',
    createdAt: new Date()
  })

// updateVariant :: Variant -> String -> Promise<Nano.DatabaseUpdateResponse>
export const updateVariant = curry((variant, id) =>
  get(id).then(oldVariant => {
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
)

// destroyVariant :: String -> Promise<Nano.DatabaseUpdateResponse>
export const destroyVariant = id =>
  get(id).then(variant => {
    const { rev } = variant
    return update({ ...variant, disabled: true }, id, rev)
  })
