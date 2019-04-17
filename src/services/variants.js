import { curry, pipe, then } from 'ramda'
import database from 'database'

const { get, insert, update, findOne, findAll } = database

export const variantFields = [
  'productId',
  'name',
  'quantity',
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
