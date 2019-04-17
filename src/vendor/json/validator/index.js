import { assoc, curry } from 'ramda'
import { mapCatchError } from 'util/promise'

import Ajv from 'ajv'

export const validator = new Ajv({
  $data: true,
  allErrors: true,
  jsonPointers: true
})

// compileSchema :: Ajv.Schema -> Object -> Promise<Object>
export const compileSchema = curry((schema, data) =>
  validator
    .compile({ $async: true, ...schema })(data)
    .catch(mapCatchError(assoc('code', 'EVALIDATION')))
)
