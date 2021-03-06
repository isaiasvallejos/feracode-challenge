import { expect } from 'chai'

import { createDatabaseHelper } from 'database'

describe('database', () => {
  it('helper must contains all data methods', () => {
    const helper = createDatabaseHelper(process.env.TEST_COUCHDB_DATABASE)

    expect(helper).to.include.all.keys([
      'insert',
      'insertWithId',
      'insertDesign',
      'view',
      'reduce',
      'groupReduce',
      'get',
      'destroy',
      'destroyView',
      'update',
      'designUpdate',
      'list',
      'find',
      'findAll',
      'findOne',
      'createIndex'
    ])
  })
})
