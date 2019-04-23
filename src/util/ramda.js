import { partialRight, flip, mergeDeepWith, concat, append } from 'ramda'

/**
 * @see https://ramdajs.com/docs
 */

export const flippedPartialRight = flip(partialRight)

export const mergeDeepAlsoConcat = mergeDeepWith(concat)

export const appendFlip = flip(append)
