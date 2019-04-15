import { map } from 'ramda'
import { flippedPartialRight } from 'util/ramda'

import { instanceDatabaseAsDefault } from 'vendor/couchdb/connection'
import * as data from 'vendor/couchdb/data'

export const createDatabaseHelper = name => {
  const database = instanceDatabaseAsDefault(name)

  // Map object to contain all data module functions
  return {
    ...map(flippedPartialRight([database]), data)
  }
}
