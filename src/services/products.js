import { curry, pipe, then } from 'ramda'
import { variantFields } from './variants'
import database from 'database'

const { get, insert, update, findOne, findAll, view } = database

export const productFields = [
  'name',
  'description',
  'disabled',
  'createdAt',
  'updatedAt'
]

// getProduct :: String -> Promise<Product>
export const getProduct = id =>
  findOne(id, {
    fields: productFields,
    selector: { type: { $eq: 'product' } }
  })

// insertProduct :: Product -> Promise<Ok>
export const insertProduct = product =>
  insert({
    ...product,
    type: 'product',
    createdAt: new Date()
  })

// updateProduct :: String -> Product -> Promise<Nano.DatabaseUpdateResponse>
export const updateProduct = curry((id, product) =>
  pipe(
    get,
    then(oldProduct => {
      const { rev } = oldProduct
      return update(
        {
          ...oldProduct,
          ...product,
          updatedAt: new Date()
        },
        id,
        rev
      )
    })
  )(id)
)

// destroyProduct :: String -> Promise<Nano.DatabaseUpdateResponse>
export const destroyProduct = id =>
  pipe(
    get,
    then(product => {
      const { rev } = product
      return update({ ...product, disabled: true }, id, rev)
    })
  )(id)

// listEnabledProducts :: Promise<Products[]>
export const listEnabledProducts = () =>
  findAll({
    fields: productFields,
    selector: { type: { $eq: 'product' }, disabled: { $eq: false } }
  })

// listAllProducts :: Promise<Products[]>
export const listAllProducts = () =>
  findAll({
    fields: productFields,
    selector: { type: { $eq: 'product' } }
  })

// getProductVariants :: String -> Promise<Variant[]>
export const getProductVariants = productId =>
  findAll({
    fields: variantFields,
    selector: { type: { $eq: 'variant' }, productId: { $eq: productId } }
  })
