import express from 'express'
import { getBody, getIdParam } from 'util/server/api/requests'
import {
  responseWithDataAndSuccess,
  responseWithData,
  responseWithCreated,
  responseWithSuccess
} from 'util/server/api/responses'

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
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.get('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return getProduct(id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.get('/:id/variants', (request, response, next) => {
  const id = getIdParam(request)

  return getProductVariants(id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.post('/', (request, response, next) => {
  const product = getBody(request)

  return validateProduct(product)
    .then(insertProduct)
    .then(responseWithData(response))
    .then(responseWithCreated(response))
    .then(() => responseWithSuccess(next))
    .catch(next)
})

router.delete('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return destroyProduct(id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.put('/:id', (request, response, next) => {
  const product = getBody(request)
  const id = getIdParam(request)

  return validateProduct(product)
    .then(updateProduct(id))
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

export default router
