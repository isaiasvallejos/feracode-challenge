import express from 'express'
import http from 'http'

import { postRoutesMiddlewares, preRoutesMiddlewares } from './middlewares'
import routes from './routes'

export const app = express()
export const server = http.createServer(app)

app.disable('x-powered-by')
app.use('/api', preRoutesMiddlewares)
app.use('/api', routes)
app.use('/api', postRoutesMiddlewares)

export default server
