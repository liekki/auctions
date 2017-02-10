import React from 'karet'
import Kefir from 'kefir'
import R from 'ramda'

import { waitForPromises, withUnmount$ } from 'utils/containers'
import { createAction, persistentProperty } from 'utils/store'
import { sortedBy$, sortTable } from './itemListViewStore'
import * as api from 'api'

import { Table, Item, Gold } from 'components'
import { marketValue } from 'utils'

export default waitForPromises(({ params: { searchString }}) =>
  ({ items: api.findItemsByName(searchString).then(items => items.map(item => ({ ...item, frequency: item.prices.length, value: marketValue(item.prices) }))) }),
  (prevProps, nextProps) => prevProps.params.searchString !== nextProps.params.searchString,
  withUnmount$(({ items, unmount$ }) => {

    const items$ = persistentProperty(Kefir.constant(items))

    const tableFields = [
      {
        title: 'Name',
        key: 'fullName',
        render: (data) => <Item data={data} />
      },
      {
        title: 'Frequency',
        key: 'frequency',
        render: ({frequency}) => `Seen ${frequency} times`
      },
      {
        title: 'Market Value',
        key: 'value',
        render: ({value}) => <Gold value={value} />
      }
    ]

    const sortFn = async (field) => {
      const sorting = await sortedBy$.take(1).toPromise()
      const direction = (field.key === sorting.key && sorting.direction !== 'DESC')
        ? 'DESC'
        : 'ASC'

      sortTable({key: field.key, direction: direction})
    }

    const sortedItems$ = Kefir.combine(
      [items$, sortedBy$],
      (items, sortedBy) => {
        const directionFn = sortedBy.direction === 'ASC' ? R.identity : R.reverse
        const toLowerIfString = (val) => (val && val.toLowerCase) ? val.toLowerCase() : val
        const sortBy = R.compose(directionFn, R.sortBy(R.compose(toLowerIfString, R.prop(sortedBy.key))))

        return sortBy(items)
      }
    ).toProperty()

    return (
      <div>
        <Table fields={tableFields} sortedBy={sortedBy$} data={sortedItems$} sortFn={sortFn} />
      </div>
    )
  })
)
