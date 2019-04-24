import database from 'database'
import {
  updateStock,
  updateStockOnPurchase,
  updateStockPrediction
} from './updates'
import { purchasesView } from './views'

const { insertDesign } = database

export const createStockDesign = () =>
  insertDesign(
    {
      updates: {
        register: updateStock,
        purchase: updateStockOnPurchase,
        'prediction:soldout': updateStockPrediction
      },
      views: {
        purchases: purchasesView
      }
    },
    'stock'
  )
