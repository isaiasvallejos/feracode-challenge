import { curry, compose } from 'ramda'
import { concatAll } from 'ramda-adjunct'
import nano from 'nano'

// getDefaultConnectionUrl :: String
export const getDefaultConnectionUrl = () =>
  concatAll([
    process.env.COUCHDB_PROTOCOL,
    '://',
    process.env.COUCHDB_USER,
    ':',
    process.env.COUCHDB_PASSWORD,
    '@',
    process.env.COUCHDB_HOST,
    ':',
    process.env.COUCHDB_PORT
  ])

// Alias for nano function
export const instanceConnection = nano

// createConnection :: String -> Nano.Connection
export const createConnection = url => instanceConnection(url)

// useDatabase :: String -> Nano.Connection -> Nano.Database
export const useDatabase = curry((name, connection) => connection.use(name))

// instanceDatabase :: String -> String -> Nano.Database
export const instanceDatabase = curry((url, name) =>
  compose(
    useDatabase(name),
    createConnection
  )(url)
)

// createDatabase :: String -> Nano.Connection -> Promise<Nano.DatabaseCreateResponse>
export const createDatabase = curry((name, connection) =>
  connection.db.create(name)
)

// destroyDatabase :: String -> Nano.Connection -> Promise<Nano.DatabaseDestroyResponse>
export const destroyDatabase = curry((name, connection) =>
  connection.db.destroy(name)
)
