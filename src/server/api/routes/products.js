import express from 'express'
import { pipe, then, otherwise } from 'ramda'
import { getBody, getIdParam } from 'util/server/api/requests'
import {
  responseWithDataAndSuccess,
  responseWithDataAndCreated
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
  return pipe(
    listEnabledProducts,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )()
})

router.get('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return pipe(
    getProduct,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

router.get('/:id/variants', (request, response, next) => {
  const id = getIdParam(request)

  return pipe(
    getProductVariants,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

router.post('/', (request, response, next) => {
  const product = getBody(request)

  return pipe(
    validateProduct,
    then(insertProduct),
    then(responseWithDataAndCreated(response, next)),
    otherwise(next)
  )(product)
})

router.delete('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return pipe(
    destroyProduct,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

router.put('/:id', (request, response, next) => {
  const product = getBody(request)
  const id = getIdParam(request)

  return pipe(
    validateProduct,
    then(updateProduct(id)),
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(product)
})

export default router
