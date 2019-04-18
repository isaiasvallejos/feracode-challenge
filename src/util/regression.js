import { curry } from 'ramda'
import regression from 'regression'

// createLinearRegression :: Pair[] -> Result
export const createLinearRegression = regression.linear

// predictLinearRegression :: Number -> Result -> Number
export const predictLinearRegression = curry((value, result) =>
  result.predict(value)
)
