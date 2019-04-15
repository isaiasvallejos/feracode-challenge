import { compose, times } from 'ramda'
import { expect } from 'chai'
import faker from 'faker'

import {
  destroyDatabase,
  createDatabase,
  createConnectionAsDefault,
  instanceDatabaseAsDefault
} from 'vendor/couchdb/connection'

import {
  insert,
  get,
  update,
  list,
  findAll,
  createIndex
} from 'vendor/couchdb/data'

describe('database → couchdb', () => {
  const DATABASE_NAME = process.env.TEST_COUCHDB_DATABASE

  // Instance database with environment variables
  let connection = createConnectionAsDefault()
  let database

  beforeEach('should create test database', () => {
    return createDatabase(DATABASE_NAME, connection).then(() => {
      database = instanceDatabaseAsDefault(DATABASE_NAME)
    })
  })

  const insertTestDocument = () =>
    insert(
      {
        name: faker.name.findName(),
        createdAt: new Date()
      },
      database
    )

  const insertNTestDocuments = n => Promise.all(times(insertTestDocument, n))

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
            name: faker.name.findName(),
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

  it('should list all documents', () => {
    return insertNTestDocuments(3)
      .then(() => list(database))
      .then(responseList => {
        expect(responseList)
          .to.be.an('array')
          .and.lengthOf(3)

        responseList.every(response =>
          expect(response).to.include.all.keys(['id', 'rev'])
        )
      })
  })

  it('should find documents with mango query', () => {
    return createIndex(
      {
        index: { fields: ['name'] },
        name: 'sort-name'
      },
      database
    )
      .then(() => insertNTestDocuments(5))
      .then(() =>
        findAll(
          {
            sort: [
              {
                name: 'asc'
              }
            ],
            fields: ['name', 'createdAt'],
            limit: 3
          },
          database
        )
      )
      .then(responseList => {
        expect(responseList)
          .to.be.an('array')
          .and.lengthOf(3)

        responseList.every(response =>
          expect(response).to.have.all.keys(['id', 'rev', 'name', 'createdAt'])
        )
      })
  })

  afterEach('should delete test database', () => {
    return destroyDatabase(DATABASE_NAME, connection)
  })
})
