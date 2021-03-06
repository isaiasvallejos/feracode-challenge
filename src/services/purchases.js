import {
  curry,
  then,
  pipe,
  map,
  flatten,
  applySpec,
  prop,
  compose,
  sortBy
} from 'ramda'
import { parse, getTime } from 'date-fns'
import { getKey, getValue } from 'vendor/couchdb/util'

import database from 'database'

const { designUpdate, insert, findAll, groupReduce, follow } = database

export const purchaseFields = ['variantId', 'quantity', 'date']

// getQuantity :: Purchase -> Number
export const getQuantity = prop('quantity')

// getDate :: Purchase -> Date
export const getDate = compose(
  parse,
  prop('date')
)

// getDateAsTime :: Purchase -> Date
export const getDateAsTime = compose(
  getTime,
  getDate
)

// registerPurchase :: Purchase -> Promise<Ok>
export const registerPurchase = ({ quantity, variantId }) =>
  designUpdate('stock', 'purchase', { quantity }, variantId)

// insertPurchase :: Purchase -> Promise<Ok>
export const insertPurchase = purchase =>
  pipe(
    registerPurchase,
    then(() =>
      insert({
        ...purchase,
        type: 'purchase',
        date: new Date()
      })
    )
  )(purchase)

// listAllPurchases :: Promise<Purchase[]>
export const listAllPurchases = () =>
  findAll({
    fields: purchaseFields,
    selector: { type: { $eq: 'purchase' } }
  })

// listReducedPurchases :: Promise<PurchaseGroup[]>
export const listReducedPurchases = () =>
  pipe(
    groupReduce('stock', 'purchases'),
    then(
      map(
        applySpec({
          variantId: getKey,
          purchases: compose(
            flatten,
            getValue
          )
        })
      )
    )
  )({})

// sortPurchasesByDate :: Purchase[] -> Purchase[]
export const sortPurchasesByDate = sortBy(getDateAsTime)

// getPurchasesFeed :: Nano.Follow
export const getPurchasesFeed = () =>
  follow({
    since: 'now',
    filter: function(document, request) {
      if (document.type != 'purchase') {
        return false
      }
      return true
    }
  })
