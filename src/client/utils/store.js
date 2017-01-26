import R from 'ramda'
import { createAction, persistentProperty } from 'utils'

export { createAction, persistentProperty }

export function createActionProperty(getCurrentFn, promiseFn) {
  const [ actionEmitter, actionStream ] = createAction(promiseFn)
  return [ actionEmitter, actionStream.toProperty(getCurrentFn) ]
}

export function createMountUnmount() {
  const [ ref, ref$ ] = createAction()
  const mount$ = ref$.filter(R.identity)
  const unmount$ = ref$.filter(R.isNil)
  return [ ref, mount$, unmount$ ]
}

