import express from 'express'
import { getBody, getIdParam } from 'util/server/api/requests'
import { responseWithDataAndNext } from 'util/server/api/responses'

import { validateProduct } from 'schemas'
import {
  insertProduct,
  destroyProduct,
  updateProduct,
  getProduct,
  listEnabledProducts,
  getProductVariants
} from 'services/products'

const router = express.Router()

router.get('/', (request, response, next) => {
  return listEnabledProducts()
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

router.get('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return getProduct(id)
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

router.get('/:id/variants', (request, response, next) => {
  const id = getIdParam(request)

  return getProductVariants(id)
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

router.post('/', (request, response, next) => {
  const product = getBody(request)

  return validateProduct(product)
    .then(insertProduct)
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

router.delete('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return destroyProduct(id)
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

router.put('/:id', (request, response, next) => {
  const product = getBody(request)
  const id = getIdParam(request)

  return updateProduct(product, id)
    .then(responseWithDataAndNext(response, next))
    .catch(next)
})

export default router
