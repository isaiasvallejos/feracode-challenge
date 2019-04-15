import { curry, compose, mergeDeepWith, flip, concat, map } from 'ramda'
import {
  getRowsDocuments,
  fixDocumentKeys,
  getDocuments,
  fixDocumentsKeys
} from './util'

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

// destroy :: String -> String -> Nano.Database -> Promise<Nano.DatabaseDestroyResponse>
export const destroy = curry((id, rev, database) => database.destroy(id, rev))

// list :: Nano.Database -> Promise<Nano.DatabaseGetResponse[]>
export const list = database =>
  database.list({ include_docs: true }).then(getRowsDocuments)

// find :: Nano.MangoQuery -> Nano.Database -> Promise<Nano.DatabaseGetResponse[]>
export const find = curry((query, database) =>
  database
    .find(query)
    .then(getDocuments)
    .then(fixDocumentsKeys)
)

// findAll :: Nano.MangoQuery -> Nano.Database -> Promise<Nano.DatabaseGetResponse[]>
export const findAll = curry((query, database) =>
  compose(
    query => find(query, database),
    mergeDeepWith(concat, {
      fields: ['_id', '_rev'],
      selector: { _id: { $gt: null } }
    })
  )(query)
)

// createIndex :: Nano.IndexObject -> Nano.Database -> Promise<Nano.DatabaseIndexResponse>
export const createIndex = curry((indexObject, database) =>
  database.createIndex(indexObject)
)
