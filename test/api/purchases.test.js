import faker from 'faker'
import {
  createTestDatabase,
  destroyTestDatabase,
  getTestRequest
} from '../util'

import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'util/server/api/status'

describe('api → purchases', () => {
  before('should create test database', createTestDatabase)

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

  before('should insert a product', done => {
    getTestRequest()
      .post('/api/products')
      .send(product)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id', 'rev'])

        variant.productId = response.body.data.id
        done()
      })
  })

  before('should insert a variant', done => {
    getTestRequest()
      .post('/api/variants')
      .send(variant)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id'])

        purchase.variantId = response.body.data.id
        done()
      })
  })

  before('should update variant stock', done => {
    getTestRequest()
      .post(`/api/variants/${purchase.variantId}/stock`)
      .send({ quantity: 100 })
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id'])
        done()
      })
  })

  step('should insert a purchase', done => {
    getTestRequest()
      .post('/api/purchases')
      .send(purchase)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id'])
        done()
      })
  })

  step('should update variant properties after purchase', done => {
    getTestRequest()
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
      getTestRequest()
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
      getTestRequest()
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

  after('should delete test database', destroyTestDatabase)
})
