import { logError } from 'log'
import { compose, pipe, then, map, otherwise } from 'ramda'
import { getPurchasesFeed, listReducedPurchases } from 'services/purchases'
import { predictAndRegisterSoldOutPrediction } from 'services/predictions'

const purchasesFeed = getPurchasesFeed()

export const makePredictions = pipe(
  listReducedPurchases,
  then(
    compose(
      predictionsRegisters => Promise.all(predictionsRegisters),
      map(predictAndRegisterSoldOutPrediction)
    )
  ),
  otherwise(logError)
)

purchasesFeed.on('change', makePredictions)
purchasesFeed.on('error', logError)

export const startPredictionsInterval = () => {
  setInterval(makePredictions, 60000)
}

export const startPredictionsFollow = () => purchasesFeed.follow()

export default () => {
  startPredictionsFollow()
  startPredictionsInterval()
}
