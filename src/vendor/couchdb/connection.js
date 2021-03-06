import { curry, compose, always } from 'ramda'
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

// createConnectionAsDefault :: Nano.Connection
export const createConnectionAsDefault = compose(
  createConnection,
  getDefaultConnectionUrl
)

// useDatabase :: String -> Nano.Connection -> Nano.Database
export const useDatabase = curry((name, connection) => connection.use(name))

// instanceDatabase :: String -> String -> Nano.Database
export const instanceDatabase = curry((name, url) =>
  compose(
    useDatabase(name),
    createConnection
  )(url)
)

// instanceDatabase :: String -> Nano.Database
export const instanceDatabaseAsDefault = name =>
  compose(
    useDatabase(name),
    createConnectionAsDefault
  )()

// createDatabase :: String -> Nano.Connection -> Promise<Nano.DatabaseCreateResponse>
export const createDatabase = curry((name, connection) =>
  connection.db.create(name)
)

// destroyDatabase :: String -> Nano.Connection -> Promise<Nano.DatabaseDestroyResponse>
export const destroyDatabase = curry((name, connection) =>
  connection.db.destroy(name)
)

// getDatabase :: String -> Nano.Connection -> Promise<Nano.DatabaseInfoResponse>
export const getDatabase = curry((name, connection) => connection.db.get(name))

// getDatabaseOrNil :: String -> Nano.Connection -> Promise<Nano.DatabaseInfoResponse>
export const getDatabaseOrNil = curry((name, connection) =>
  getDatabase(name, connection).catch(always(null))
)
