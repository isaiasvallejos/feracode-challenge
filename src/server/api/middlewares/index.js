import errorsMiddleware from './errors'
import mapErrorsMiddleware from './map-errors'
import notRouteMiddleware from './no-route'
import dataMiddleware from './data'
import bodyParser from 'body-parser'

export const preRoutesMiddlewares = [bodyParser.json()]

export const postRoutesMiddlewares = [
  mapErrorsMiddleware,
  errorsMiddleware,
  dataMiddleware,
  notRouteMiddleware
]
