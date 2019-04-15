import { prop, curry } from 'ramda'

// getStatusCode :: Response -> Integer
export const getStatusCode = prop('statusCode')

// getError :: Response -> Object
export const getError = prop('error')

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

// responseWithJson :: Object -> Response
export const responseWithJson = curry((response, json) => response.json(json))
