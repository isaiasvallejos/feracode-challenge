import { compileSchema, validator } from 'vendor/json/validator'
import database from 'database'

const { findOne } = database

validator.addKeyword('reference', {
  async: true,
  type: 'string',
  validate: (type, id) => findOne(id, { selector: { type: { $eq: type } } })
})

// validateProduct :: Product -> Promise<Product>
export const validateProduct = compileSchema({
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    disabled: {
      type: 'boolean'
    }
  },
  required: ['name', 'description', 'disabled'],
  additionalProperties: false
})

// validateVariant :: Variant -> Promise<Variant>
export const validateVariant = compileSchema({
  properties: {
    productId: {
      type: 'string',
      reference: 'product'
    },
    name: {
      type: 'string'
    },
    disabled: {
      type: 'boolean'
    }
  },
  required: ['productId', 'name', 'disabled'],
  additionalProperties: false
})

// validatePurchase :: Purchase :: Promise<Purchase>
export const validatePurchase = compileSchema({
  properties: {
    variantId: {
      type: 'string',
      reference: 'variant'
    },
    quantity: {
      type: 'number',
      minimum: 1
    }
  },
  required: ['variantId', 'quantity'],
  additionalProperties: false
})

// validateStock :: Stock :: Promise<Stock>
export const validateStock = compileSchema({
  properties: {
    variantId: {
      type: 'string',
      reference: 'variant'
    },
    quantity: {
      type: 'number',
      minimum: 0
    }
  },
  required: ['variantId', 'quantity'],
  additionalProperties: false
})
