import faker from 'faker'
import {
  createTestDatabase,
  destroyTestDatabase,
  getTestRequest
} from '../util'

import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'util/server/api/status'

describe('api → variants', () => {
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

  const updatedVariant = {
    ...variant,
    name: 'M'
  }

  let variantId

  before('should insert a product', done => {
    getTestRequest()
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
    getTestRequest()
      .post('/api/variants')
      .send(variant)
      .end((error, response) => {
        response.should.have.status(CREATED)
        response.body.data.should.to.include.all.keys(['id'])

        variantId = response.body.data.id
        done()
      })
  })

  step('should get a variant', done => {
    getTestRequest()
      .get(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include({
          ...variant,
          quantity: 0
        })
        done()
      })
  })

  step('should get all product variants', done => {
    getTestRequest()
      .get(`/api/products/${variant.productId}/variants`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('array').and.have.lengthOf(1)
        response.body.data[0].should.to.deep.include(variant)
        done()
      })
  })

  step('should update a variant', done => {
    getTestRequest()
      .put(`/api/variants/${variantId}`)
      .send(updatedVariant)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })

  step('should update variant stock', done => {
    getTestRequest()
      .post(`/api/variants/${variantId}/stock`)
      .send({ quantity: 100 })
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id'])
        done()
      })
  })

  step('should get a updated variant', done => {
    getTestRequest()
      .get(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.be.a('object')
        response.body.data.should.to.deep.include({
          ...updatedVariant,
          quantity: 100
        })
        done()
      })
  })

  step('should delete a variant', done => {
    getTestRequest()
      .delete(`/api/variants/${variantId}`)
      .end((error, response) => {
        response.should.have.status(OK)
        response.body.data.should.to.include.all.keys(['id', 'rev'])
        done()
      })
  })
  describe('errors', done => {
    it('should fail on insert a bad variant', done => {
      getTestRequest()
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
      getTestRequest()
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
      getTestRequest()
        .get(`/api/variants/fakeid`)
        .end((error, response) => {
          response.should.have.status(NOT_FOUND)
          done()
        })
    })
  })

  after('should delete test database', destroyTestDatabase)
})
