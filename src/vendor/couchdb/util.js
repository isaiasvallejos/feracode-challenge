import { map, compose, prop, omit } from 'ramda'
import { renameKeys } from 'ramda-adjunct'

// getRows :: DatabaseDocumentResponse[]
export const getRows = prop('rows')

// getDocument :: DatabaseGetResponse
export const getDocument = prop('doc')

// getKey :: String
export const getKey = prop('key')

// getValue :: Any
export const getValue = prop('value')

// getDocuments :: Nano.DatabaseFindResponse -> DatabaseGetResponse[]
export const getDocuments = prop('docs')

// fixDocumentKeys :: DatabaseGetResponse -> DatabaseGetResponse
export const fixDocumentKeys = renameKeys({
  _id: 'id',
  _rev: 'rev'
})

// fixDocumentsKeys :: DatabaseGetResponse[] -> DatabaseGetResponse[]
export const fixDocumentsKeys = map(fixDocumentKeys)

// getBodyRowsDocuments :: Nano.DatabaseListResponse -> DatabaseGetResponse[]
export const getRowsDocuments = compose(
  map(
    compose(
      fixDocumentKeys,
      getDocument
    )
  ),
  getRows
)

// sanitizeDocument :: Object -> Object
export const sanitizeDocument = omit(['rev', 'id', '_id', '_rev'])
