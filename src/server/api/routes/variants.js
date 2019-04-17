import express from 'express'
import { pipe, then, otherwise } from 'ramda'
import { getBody, getIdParam } from 'util/server/api/requests'
import {
  responseWithDataAndSuccess,
  responseWithDataAndCreated
} from 'util/server/api/responses'

import { validateVariant } from 'schemas'
import {
  insertVariant,
  destroyVariant,
  updateVariant,
  getVariant
} from 'services/variants'

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
    updateVariant(variant),
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )(id)
})

export default router
