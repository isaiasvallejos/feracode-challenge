import { prop, curry, complement, compose, pipe } from 'ramda'
import { toBoolean } from 'util/cast'
import { getBody } from './requests'
import { mapError } from 'util/error'

// getStatusCode :: Response -> Integer
export const getStatusCode = prop('statusCode')

// getError :: Response -> Object
export const getError = prop('error')

// getData :: Response -> object
export const getData = prop('data')

// responseWithBadRequest :: Response -> Response
export const responseWithBadRequest = response => response.status(400)

// responseWithUnauthorized :: Response -> Response
export const responseWithUnauthorized = response => response.status(401)

// responseWithNotFound :: Response -> Response
export const responseWithNotFound = response => response.status(404)

// responseWithOk :: Response -> Response
export const responseWithOk = response => response.status(200)

// responseWithCreated : Response -> Response
export const responseWithCreated = response => response.status(201)

// responseWithNoContent:: Response -> Response
export const responseWithNoContent = response => response.status(204)

// responseWithInternalError :: Response -> Response
export const responseWithInternalError = response => response.status(500)

// responseWithJson :: Object -> Response -> Response
export const responseWithJson = curry((response, json) => response.json(json))

// responseWithSuccess :: Next -> None
export const responseWithSuccess = next => next()

// responseWithError :: Next -> Error -> None
export const responseWithError = curry((next, error) => next(error))

// responseHasData :: Response -> Boolean
export const responseHasData = compose(
  toBoolean,
  getData
)

// responseNotHasData :: Response -> Boolean
export const responseNotHasData = complement(responseHasData)

// responseWithData :: Response -> Object -> Response
export const responseWithData = curry((response, data) => {
  response.data = data
  return response
})

// responseWithDataAndSuccess :: Response -> Next -> Object -> None
export const responseWithDataAndSuccess = curry((response, next, data) =>
  pipe(
    responseWithData(response),
    () => responseWithSuccess(next)
  )(data)
)

// responseWithDataAndCreated :: Response -> Next -> Object -> None
export const responseWithDataAndCreated = curry((response, next, data) =>
  pipe(
    responseWithData(response),
    responseWithCreated,
    () => responseWithSuccess(next)
  )(data)
)
