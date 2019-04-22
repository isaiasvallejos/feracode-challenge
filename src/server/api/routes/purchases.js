import express from 'express'
import { pipe, then, otherwise } from 'ramda'
import { getBody } from 'util/server/api/requests'
import {
  responseWithDataAndCreated,
  responseWithDataAndSuccess
} from 'util/server/api/responses'

import { validatePurchase } from 'schemas'
import { insertPurchase, listAllPurchases } from 'services/purchases'

const router = express.Router()

router.get('/', (request, response, next) => {
  return pipe(
    listAllPurchases,
    then(responseWithDataAndSuccess(response, next)),
    otherwise(next)
  )()
})

router.post('/', (request, response, next) => {
  const purchase = getBody(request)

  return pipe(
    validatePurchase,
    then(insertPurchase),
    then(responseWithDataAndCreated(response, next)),
    otherwise(next)
  )(purchase)
})

export default router
