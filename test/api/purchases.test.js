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
import createDatabaseDesigns from 'database/design'

import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'util/server/api/status'

describe.only('api → purchases', () => {
  const DATABASE_NAME = process.env.TEST_COUCHDB_DATABASE

  // Instance database with environment variables
  let connection = createConnectionAsDefault()

  // Instance request to express app
  const getRequest = () =>
    chai.request((() => api.listen(process.env.TEST_PORT, _ => _))())

  before('should create test database', () => {
    return createDatabase(DATABASE_NAME, connection)
      .then(createDatabaseDesigns)
      .catch(_ => _)
  })

  const product = {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(5),
    disabled: false
  }

  const variant = {
    name: 'P',
    disabled: false
  }

  const purchase = {
    quantity: 10
  }

  step('should insert a product', done => {
    getRequest()
      .post('/api/products')
      .send(product)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id', 'rev'])

        variant.productId = response.body.data.id
        done()
      })
  })

  step('should insert a variant', done => {
    getRequest()
      .post('/api/variants')
      .send(variant)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id'])

        purchase.variantId = response.body.data.id
        done()
      })
  })

  step('should update variant stock', done => {
    getRequest()
      .post(`/api/variants/${purchase.variantId}/stock`)
      .send({ quantity: 100 })
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id'])
        done()
      })
  })

  step('should insert a purchase', done => {
    getRequest()
      .post('/api/purchases')
      .send(purchase)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id'])
        done()
      })
  })

  step('should update variant properties after purchase', done => {
    getRequest()
      .get(`/api/variants/${purchase.variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include({
          ...variant,
          quantity: 90,
          purchased: 10
        })
        done()
      })
  })

  describe('errors', done => {
    it('should fail on insert a purchase negative quantity', done => {
      getRequest()
        .post('/api/purchases')
        .send({ quantity: -1 })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })

    it('should fail on purchase a bad variant', done => {
      getRequest()
        .post('/api/purchases')
        .send({ variantId: 'badid', quantity: 10 })
        .end((error, response) => {
          response.should.have.status(BAD_REQUEST)
          response.body.should.to.include.key('error')
          response.body.error.should.to.include.all.keys(['errors', 'message'])
          done()
        })
    })
  })

  after('should delete test database', () => {
    return destroyDatabase(DATABASE_NAME, connection)
  })
})
