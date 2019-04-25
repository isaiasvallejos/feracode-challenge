import expressWinston from 'express-winston'
import winston from 'winston'

expressWinston.requestWhitelist.push('body')

export const loggerMiddleware = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json())
})

export const errorLoggerMiddleware = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json())
})
