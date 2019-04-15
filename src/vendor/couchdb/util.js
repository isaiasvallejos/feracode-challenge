import { map, compose, prop } from 'ramda'
import { renameKeys } from 'ramda-adjunct'

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
      prop('doc')
    )
  ),
  prop('rows')
)

// getDocuments :: Nano.DatabaseFindResponse -> DatabaseGetResponse[]
export const getDocuments = prop('docs')
