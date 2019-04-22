import express from 'express'
import { pipe, then, otherwise } from 'ramda'
import { getBody, getIdParam } from 'util/server/api/requests'
import {
  responseWithDataAndSuccess,
  responseWithDataAndCreated
} from 'util/server/api/responses'

import { validateVariant, validateStock, validatePurchase } from 'schemas'
import {
  insertVariant,
  destroyVariant,
  updateVariant,
  getVariant
} from 'services/variants'

import { registerStock } from 'services/stock'
import { insertPurchase } from 'services/purchases'

const router = express.Router()

router.get('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return pipe(
    getVariant,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

router.post('/', (request, response, next) => {
  const variant = getBody(request)

  return pipe(
    validateVariant,
    then(insertVariant),
    then(responseWithDataAndCreated(response, next)),
    otherwise(next)
  )(variant)
})

router.delete('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return pipe(
    destroyVariant,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

router.put('/:id', (request, response, next) => {
  const variant = getBody(request)
  const id = getIdParam(request)

  return pipe(
    validateVariant,
    then(updateVariant(id)),
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(variant)
})

router.post('/:id/stock', (request, response, next) => {
  const variantId = getIdParam(request)
  const { quantity } = getBody(request)

  const stock = { variantId, quantity }

  return pipe(
    validateStock,
    then(registerStock),
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(stock)
})

router.post('/:id/purchase', (request, response, next) => {
  const variantId = getIdParam(request)
  const { quantity } = getBody(request)

  const purchase = { variantId, quantity }

  return pipe(
    validatePurchase,
    then(insertPurchase),
    then(responseWithDataAndCreated(response, next)),
    otherwise(next)
  )(purchase)
})

export default router
