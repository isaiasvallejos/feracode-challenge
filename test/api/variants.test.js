import chai, { expect, should } from 'chai'
import chaiHttp from 'chai-http'
import api from 'server/api'
import faker from 'faker'

chai.use(chaiHttp)
chai.should()

import {
  destroyDatabase,
  createDatabase,
  createConnectionAsDefault
} from 'vendor/couchdb/connection'

import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'util/server/api/status'

describe('api → variants', () => {
  const DATABASE_NAME = process.env.TEST_COUCHDB_DATABASE

  // Instance database with environment variables
  let connection = createConnectionAsDefault()

  // Instance request to express app
  const getRequest = () =>
    chai.request((() => api.listen(process.env.TEST_PORT, _ => _))())

  before('should create test database', () => {
    return createDatabase(DATABASE_NAME, connection).catch(_ => _)
  })

  const product = {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(5),
    disabled: false
  }

  const variant = {
    name: 'P',
    disabled: false,
    quantity: 100
  }

  const updatedVariant = {
    ...variant,
    name: 'M',
    quantity: 200
  }

  let variantId

  step('should insert a product', done => {
    getRequest()
      .post('/api/products')
      .send(product)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id', 'rev'])

        variant.productId = response.body.data.id
        updatedVariant.productId = response.body.data.id
        done()
      })
  })

  step('should insert a variant', done => {
    getRequest()
      .post('/api/variants')
      .send(variant)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id', 'rev'])

        variantId = response.body.data.id
        done()
      })
  })

  step('should get a variant', done => {
    getRequest()
      .get(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include(variant)
        done()
      })
  })

  step('should update a variant', done => {
    getRequest()
      .put(`/api/variants/${variantId}`)
      .send(updatedVariant)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })

  step('should get a updated variant', done => {
    getRequest()
      .get(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include(updatedVariant)
        done()
      })
  })

  step('should delete a variant', done => {
    getRequest()
      .delete(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })

  describe('errors', done => {
    it('should fail on insert a bad variant', done => {
      getRequest()
        .post('/api/variants')
        .send({ badrequest: true })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })

    it('should fail on update a bad variant', done => {
      getRequest()
        .put(`/api/variants/${variantId}`)
        .send({ badrequest: true })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })

    it('should not found an nonexistent variant', done => {
      getRequest()
        .get(`/api/variants/fakeid`)
        .end((error, response) => {
          response.should.have.status(NOT_FOUND)
          done()
        })
    })
  })

  after('should delete test database', () => {
    return destroyDatabase(DATABASE_NAME, connection)
  })
})
