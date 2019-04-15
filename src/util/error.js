import { compose } from 'ramda'
import { safeJsonParse } from './json'

// errorToJson :: Error -> String
export const errorToJson = error =>
  JSON.stringify(error, Object.getOwnPropertyNames(error))

// errorToObject :: Error -> Object
export const errorToObject = compose(
  safeJsonParse,
  errorToJson
)
