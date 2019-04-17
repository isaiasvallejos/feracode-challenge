import { cond, applySpec, equals, pipe, compose, always, T } from 'ramda'

import {
  responseWithBadRequest,
  responseWithInternalError
} from 'util/server/api/responses'
import { getErrorCode } from 'util/error'

export default (error, request, response, next) =>
  pipe(
    cond([
      [
        compose(
          equals('EVALIDATION'),
          getErrorCode
        ),
        () => responseWithBadRequest(response)
      ],
      [T, () => responseWithInternalError(response)]
    ]),
    () => next(error)
  )(error)
