import { curry } from 'ramda'
import { getRowsDocuments, fixDocumentKeys } from './util'

// insert :: Object -> Nano.Database -> Promise<Nano.DatabaseInsertResponse>
export const insert = curry((data, database) => database.insert(data))

// update :: Object -> String -> Nano.Database -> Promise<Nano.DatabaseUpdateResponse>
export const update = curry((data, id, rev, database) =>
  database.insert({ ...data, _rev: rev }, id)
)

// get :: String -> Nano.Database -> Promise<Nano.DatabaseGetResponse>
export const get = curry((id, database) =>
  database.get(id).then(fixDocumentKeys)
)

// list :: Nano.Database -> Promise<Nano.DatabaseGetResponse[]>
export const list = database =>
  database.list({ include_docs: true }).then(getRowsDocuments)
