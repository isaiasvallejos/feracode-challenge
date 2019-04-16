import express from 'express'
import http from 'http'

import { postRoutesMiddlewares, preRoutesMiddlewares } from './middlewares'

export const app = express()
export const server = http.createServer(app)

app.disable('x-powered-by')
app.use(preRoutesMiddlewares)
app.use(postRoutesMiddlewares)

export default server
