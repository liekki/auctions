import R from 'ramda'

export { default as createAction } from './createAction.js'
export { default as persistentProperty } from './persistentProperty.js'
export { default as marketValue } from './marketValue.js'

export const classNames = (...args) => R.flatten(args).filter(Boolean).join(' ')

export const groupPricesByTime = R.pipe(
  R.groupBy(R.prop('time')),
  R.map(R.pipe(R.map(R.prop('price')), R.median)),
  R.pipe(R.toPairs, R.map(R.zipObj(['time', 'price']))),
  R.sortBy(R.prop('time')),
  R.reverse
)
