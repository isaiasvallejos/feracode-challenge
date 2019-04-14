import { expect } from 'chai'

import {
  createConnection,
  instanceDatabase,
  destroyDatabase,
  createDatabase,
  getDefaultConnectionUrl
} from 'vendor/couchdb/connection'

import { insert, get, update, list } from 'vendor/couchdb/data'

describe('database → couchdb', () => {
  const DATABASE_NAME = process.env.TEST_COUCHDB_DATABASE

  // Instance database with environment variables
  const url = getDefaultConnectionUrl()
  let connection = createConnection(url)
  let database

  before('should create test database', () => {
    return createDatabase(DATABASE_NAME, connection).then(() => {
      database = instanceDatabase(url, DATABASE_NAME)
    })
  })

  const insertTestDocument = () =>
    insert(
      {
        name: 'test',
        createdAt: new Date()
      },
      database
    )

  it('should insert a document', () => {
    return insertTestDocument().then(response => {
      expect(response).to.include.all.keys(['id', 'rev'])
    })
  })

  it('should get a document', () => {
    return insertTestDocument()
      .then(({ id }) => get(id, database))
      .then(response => {
        expect(response).to.include.all.keys(['id', 'rev', 'name', 'createdAt'])
      })
  })

  it('should update a document', () => {
    return insertTestDocument()
      .then(({ id, rev }) =>
        update(
          {
            updatedAt: new Date()
          },
          id,
          rev,
          database
        )
      )
      .then(response => {
        expect(response).to.include.all.keys(['id', 'rev'])
      })
  })

  it('should list documents', () => {
    const inserts = Promise.all([
      insertTestDocument(),
      insertTestDocument(),
      insertTestDocument()
    ])

    return inserts
      .then(() => list(database))
      .then(responseList => {
        expect(responseList)
          .to.be.an('array')
          .and.lengthOf.at.least(3)

        responseList.every(response =>
          expect(response).to.include.all.keys(['id', 'rev'])
        )
      })
  })

  after('should delete test database', () => {
    return destroyDatabase(DATABASE_NAME, connection)
  })
})
