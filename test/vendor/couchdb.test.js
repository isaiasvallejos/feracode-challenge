import { expect, assert } from 'chai'
import faker from 'faker'

import {
  insert,
  get,
  update,
  list,
  findAll,
  createIndex,
  findOne
} from 'vendor/couchdb/data'

import {
  database,
  createTestDatabaseWithoutDesign,
  destroyTestDatabase
} from '../util'

describe('vendor → couchdb', () => {
  before('should create test database', createTestDatabaseWithoutDesign)

  let id
  let rev
  let testDocument = {
    type: 'test',
    name: faker.name.findName()
  }

  step('should insert a document', () => {
    return insert(testDocument, database).then(response => {
      expect(response).to.include.all.keys(['id', 'rev'])
      id = response.id
      rev = response.rev
    })
  })

  step('should get a document', () => {
    return get(id, database).then(document => {
      assert.deepInclude(document, testDocument)
      expect(document).to.include.all.keys(['id', 'rev', 'name'])
    })
  })

  step('should update a document', () => {
    let updatedDocument = {
      ...testDocument,
      name: faker.name.findName()
    }

    return update(updatedDocument, id, rev, database).then(response => {
      expect(response).to.include.all.keys(['id', 'rev'])
    })
  })

  step('should list all documents', () => {
    return insert(testDocument, database)
      .then(() => list(database))
      .then(documentList => {
        expect(documentList)
          .to.be.an('array')
          .and.lengthOf(2)

        documentList.every(document =>
          expect(document).to.include.all.keys(['id', 'rev', 'name'])
        )
      })
  })

  step('should find documents with mango query', () => {
    return createIndex(
      {
        index: { fields: ['name'] },
        name: 'sort-name'
      },
      database
    )
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
      .then(documentList => {
        expect(documentList)
          .to.be.an('array')
          .and.lengthOf(2)

        documentList.every(document =>
          expect(document).to.include.all.keys(['id', 'rev', 'name'])
        )
      })
  })

  step('should find one document by id and query', () => {
    return findOne(id, { selector: { type: { $eq: 'test' } } }, database).then(
      document => assert.isOk(document)
    )
  })

  after('should delete test database', destroyTestDatabase)
})
