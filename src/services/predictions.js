import {
  curry,
  compose,
  converge,
  pair,
  pipe,
  then,
  add,
  reduce,
  last,
  head,
  defaultTo
} from 'ramda'
import {
  createLinearRegression,
  predictLinearRegression
} from 'util/regression'
import { appendFlip } from 'util/ramda'

import { getQuantity, getDateAsTime, sortPurchasesByDate } from './purchases'
import { getVariantStockWithPurchased } from './variants'

import database from 'database'

const { designUpdate } = database

// registerSoldOutPrediction :: String -> Date -> Promise<Ok>
export const registerSoldOutPrediction = curry((variantId, prediction) =>
  designUpdate('stock', 'prediction:soldout', { prediction }, variantId)
)

// mapPurchaseAsPredictionPair :: Purchase -> Number -> Pair
export const mapPurchaseAsPredictionPair = curry((purchase, stock) =>
  converge(pair, [
    compose(
      add(stock),
      getQuantity
    ),
    getDateAsTime
  ])(purchase)
)

// registerVariantSoldOutPrediction :: String -> Pair[] -> Promise<Ok>
export const registerVariantSoldOutPrediction = curry((variantId, pairs) =>
  pipe(
    getVariantStockWithPurchased,
    then(stockWithPurchased =>
      compose(
        registerSoldOutPrediction(variantId),
        predictLinearRegression(stockWithPurchased),
        createLinearRegression
      )(pairs)
    )
  )(variantId)
)

// getLastPairStock :: Pair[] -> Number
export const getLastPairStock = compose(
  head,
  defaultTo([0, 0]),
  last
)

// reducePurchasesAsPredictionPairs -> Purchase[] -> Pair[]
export const reducePurchasesAsPredictionPairs = reduce(
  (pairs, purchase) =>
    compose(
      appendFlip(pairs),
      mapPurchaseAsPredictionPair(purchase),
      getLastPairStock
    )(pairs),
  []
)

// predictAndRegisterSoldOutPrediction :: PurchaseGroup -> Number -> Promise<Ok>
export const predictAndRegisterSoldOutPrediction = ({ variantId, purchases }) =>
  compose(
    registerVariantSoldOutPrediction(variantId),
    reducePurchasesAsPredictionPairs,
    sortPurchasesByDate
  )(purchases)
