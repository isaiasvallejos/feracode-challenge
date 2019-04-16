import errorsMiddleware from './errors'
import notRouteMiddleware from './no-route'
import bodyParser from 'body-parser'

export const preRoutesMiddlewares = [bodyParser.json()]

export const postRoutesMiddlewares = [errorsMiddleware, notRouteMiddleware]
