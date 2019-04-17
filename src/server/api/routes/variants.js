import express from 'express'
import { getBody, getIdParam } from 'util/server/api/requests'
import { responseWithDataAndSuccess } from 'util/server/api/responses'

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

  return getVariant(id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.post('/', (request, response, next) => {
  const variant = getBody(request)

  return validateVariant(variant)
    .then(insertVariant)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.delete('/:id', (request, response, next) => {
  const id = getIdParam(request)

  return destroyVariant(id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

router.put('/:id', (request, response, next) => {
  const variant = getBody(request)
  const id = getIdParam(request)

  return updateVariant(variant, id)
    .then(responseWithDataAndSuccess(response, next))
    .catch(next)
})

export default router
