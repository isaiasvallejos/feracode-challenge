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

describe('api → products', () => {
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

  const updatedProduct = {
    ...product,
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(5)
  }

  let productId

  step('should insert a product', done => {
    getRequest()
      .post('/api/products')
      .send(product)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id', 'rev'])

        productId = response.body.data.id
        done()
      })
  })

  step('should get a product', done => {
    getRequest()
      .get(`/api/products/${productId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include(product)
        done()
      })
  })

  step('should get all products', done => {
    getRequest()
      .get('/api/products')
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('array').and.have.lengthOf(1)
        response.body.data[0].should.to.deep.include(product)
        done()
      })
  })

  step('should update a product', done => {
    getRequest()
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })

  step('should get a updated product', done => {
    getRequest()
      .get(`/api/products/${productId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include(updatedProduct)
        done()
      })
  })

  step('should delete a product', done => {
    getRequest()
      .delete(`/api/products/${productId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })

  step('should not list a deleted product', done => {
    getRequest()
      .get(`/api/products`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('array').and.have.lengthOf(0)
        done()
      })
  })

  describe('errors', done => {
    it('should fail on insert a bad product', done => {
      getRequest()
        .post('/api/products')
        .send({ badrequest: true })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })

    it('should fail on update a bad product', done => {
      getRequest()
        .put(`/api/products/${productId}`)
        .send({ badrequest: true })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })

    it('should not found an nonexistent product', done => {
      getRequest()
        .get(`/api/products/fakeid`)
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
