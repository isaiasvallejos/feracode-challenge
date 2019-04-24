import faker from 'faker'
import {
  createTestDatabase,
  destroyTestDatabase,
  getTestRequest
} from '../util'

import { insertProduct } from 'services/products'
import { insertVariant } from 'services/variants'
import { registerStock } from 'services/stock'
import { insertPurchase } from 'services/purchases'
import { makePredictions } from 'services/listeners/predictions'
import { registerSoldOutPrediction } from 'services/predictions'

import { OK } from 'util/server/api/status'

describe('api → prediction → sold out', () => {
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

  let variantId

  before('should insert a product', () => {
    return insertProduct(product).then(({ id }) => {
      variant.productId = id
    })
  })

  before('should insert a variant', () => {
    return insertVariant(variant).then(({ id }) => {
      variantId = id
    })
  })

  before('should update variant stock', () => {
    return registerStock({ quantity: 25, variantId })
  })

  before('should purchase variant', () => {
    return insertPurchase({ quantity: 2, variantId })
  })

  step('should not predict sold out on first purchase', done => {
    makePredictions().then(() => {
      getTestRequest()
        .get(`/api/variants/${variantId}`)
        .end((error, response) => {
          response.should.have.status(OK)
          response.body.data.should.be.a('object')
          response.body.data.should.to.include.key('soldOutIn')
          response.body.data.soldOutIn.should.to.be.equal(0)
          done()
        })
    })
  })

  before('should purchase variant', () => {
    return insertPurchase({ quantity: 2, variantId })
  })

  step('should predict sold out after second purchase', done => {
    makePredictions().then(() => {
      getTestRequest()
        .get(`/api/variants/${variantId}`)
        .end((error, response) => {
          response.should.have.status(OK)
          response.body.data.should.be.a('object')
          response.body.data.should.to.include.key('soldOutIn')
          response.body.data.soldOutIn.should.to.not.be.equal(0)
          done()
        })
    })
  })

  step('should stock to be stagnant after prediction time fails', done => {
    registerSoldOutPrediction(variantId, 0).then(() => {
      getTestRequest()
        .get(`/api/variants/${variantId}`)
        .end((error, response) => {
          response.should.have.status(OK)
          response.body.data.should.be.a('object')
          response.body.data.should.to.include.key('soldOutIn')
          response.body.data.stock.should.to.be.equal('stagnant')
          response.body.data.soldOutIn.should.to.be.equal(0)
          done()
        })
    })
  }).timeout(10000)

  after('should delete test database', destroyTestDatabase)
})
