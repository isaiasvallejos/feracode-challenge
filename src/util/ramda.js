import { partialRight, flip, mergeDeepWith, concat } from 'ramda'

/**
 * @see https://ramdajs.com/docs
 */

export const flippedPartialRight = flip(partialRight)

export const mergeDeepAlsoConcat = mergeDeepWith(concat)
