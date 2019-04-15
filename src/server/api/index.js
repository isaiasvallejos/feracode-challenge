import express from 'express'
import http from 'http'

import middlewares from './middlewares'

export const app = express()
export const server = http.createServer(app)

app.disable('x-powered-by')
app.use(middlewares)

export default server
