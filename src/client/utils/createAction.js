import R from 'ramda'
import Kefir from 'kefir'
import Promise from 'bluebird'

export default function (actionFn = R.identity) {
  let emitter
  const actionStream = Kefir.stream((emitter_) => emitter = emitter_)
  const actionEmitter = (...args) => {
    const actionResult = actionFn(...args)
    if (emitter) {
      if (actionResult.then) {
        actionResult.then((val) => emitter.value(val), (err) => emitter.error(err))
      } else {
        emitter.value(actionResult)
      }
    }
    return Promise.resolve(actionResult)
  }
  return [ actionEmitter, actionStream ]
}
