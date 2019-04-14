import { map, compose, prop } from 'ramda'
import { renameKeys } from 'ramda-adjunct'

// fixDocumentKeys :: DatabaseGetResponse -> DatabaseGetResponse
export const fixDocumentKeys = renameKeys({
  _id: 'id',
  _rev: 'rev'
})

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
