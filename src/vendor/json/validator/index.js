import Ajv from 'ajv'

export const validator = new Ajv({
  $data: true,
  allErrors: true,
  jsonPointers: true
})

// compileSchema :: Ajv.Schema -> Object -> Promise<Object>
export const compileSchema = schema =>
  validator.compile({ $async: true, ...schema })
