import 'dotenv/config'
import startServer from 'server'
import startListeners from 'services/listeners'

startServer()
startListeners()
