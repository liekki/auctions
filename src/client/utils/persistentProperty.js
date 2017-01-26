import R from 'ramda'

export default function(observable, defaultValue) {
  const getCurrentFn =
    defaultValue !== undefined
      ? (typeof defaultValue === 'function'
          ? defaultValue
          : R.always(defaultValue))
      : undefined
  const property = observable.toProperty(getCurrentFn)
  property.onValue(() => {})
  return property
}
