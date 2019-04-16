import { curry } from 'ramda'
import regression from 'regression'

// createLinearRegression :: Pair[] -> Result
export const createLinearRegression = regression.linear

// predictLinearRegression :: Result -> Number -> Number
export const predictLinearRegression = curry((result, value) =>
  result.predict(value)
)
