import chai from 'chai'
import chaiHttp from 'chai-http'
import api from 'server/api'

chai.use(chaiHttp)
chai.should()

import {
  destroyDatabase,
  getDatabaseOrNil,
  createDatabase,
  createConnectionAsDefault,
  instanceDatabaseAsDefault
} from 'vendor/couchdb/connection'
import createDatabaseDesigns from 'database/design'

const DATABASE_NAME = process.env.TEST_COUCHDB_DATABASE

export const connection = createConnectionAsDefault()
export const database = instanceDatabaseAsDefault(DATABASE_NAME)

export const destroyTestDatabase = () =>
  destroyDatabase(DATABASE_NAME, connection)

export const createTestDatabase = () =>
  getDatabaseOrNil(DATABASE_NAME, connection).then(database => {
    if (database) {
      return destroyTestDatabase().then(createTestDatabase)
    } else {
      return createDatabase(DATABASE_NAME, connection).then(
        createDatabaseDesigns
      )
    }
  })

export const createTestDatabaseWithoutDesign = () =>
  getDatabaseOrNil(DATABASE_NAME, connection).then(database => {
    if (database) {
      return destroyTestDatabase().then(createTestDatabaseWithoutDesign)
    } else {
      return createDatabase(DATABASE_NAME, connection)
    }
  })

export const getTestRequest = () =>
  chai.request((() => api.listen(process.env.TEST_PORT))())
