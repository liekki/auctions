import { createAction, persistentProperty } from 'utils/store'

const [ sortTable, onTableSorted$ ] = createAction()

const sortedBy$ = persistentProperty(onTableSorted$.scan((prev,next) => {
  const direction = (prev.key === next.key && prev.direction !== 'DESC') ? 'DESC' : 'ASC'
  return { key: next.key, direction }
}), {key: 'fullName', direction: 'ASC'})

export {
  sortedBy$,
  sortTable,
}
