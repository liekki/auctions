import React from 'karet'
import moment from 'moment'
import R from 'ramda'
import * as api from 'api'
import Kefir from 'kefir'

import { waitForPromises, withUnmount$ } from 'utils/containers'
import { Item, Gold, Table } from 'components'
import { sortedBy$, sortTable } from './itemViewStore'
import { marketValue } from 'utils'
import { asGold } from 'utils/gold'
import { persistentProperty } from 'utils/store'

import Chartist from 'chartist'
import ChartistTooltips from 'chartist-plugin-tooltips' // eslint-disable-line
import ChartistGraph from 'react-chartist'

export default waitForPromises(({ params: { id, suffix }}) =>
  ({ item: api.findItemById(id, suffix) }),
  (prevProps, nextProps) => prevProps.params.id !== nextProps.params.id || prevProps.params.suffix !== nextProps.params.suffix,
  withUnmount$(({ item, unmount$ }) => {
    if(!item)
      return (<div>Item not found</div>)

    let dataPoint
    const data = R.range(1, 15)
      .reverse()
      .map(d => moment(item.prices[0].time)
        .subtract(d, 'days').hours(24).minutes(0).seconds(0).milliseconds(0))
      .map(date => {
        let p = R.find(R.propEq('time', date.toISOString()))(item.prices)

        if(!p) {
          p = dataPoint

        } else {
          dataPoint = p.price
        }

        return {
          name: date.subtract(1, 'seconds').format('DD.MM'),
          price: dataPoint
        }
      })

    const chartData = {
      labels: data.map(d => d.name),
      series: [
        data.map(d => d.price)
      ]
    }
    const chartOptions = {
      chartPadding: { top: 20, right: 20, bottom: 20, left: 0 },
      height: '400px',
      axisY: {
        offset: 80,
        scaleMinSpace: 40,
        labelInterpolationFnc: (value) => {
          return asGold(value).filter(val => val.amount).map((val) => {
            return `${val.amount}${val.type.charAt(0)}`
          }).join(' ')
        }
      },
      reverseData: false,
      plugins: [
        Chartist.plugins.tooltip({
          anchorToPoint: true,
          transformTooltipTextFnc: (value) => {

            return value ? asGold(value).filter(val => val.amount).map((val) => {
              return `${val.amount}${val.type.charAt(0)}`
            }).join(' ') : ''
          }
        })
      ]
    }

    const items$ = persistentProperty(Kefir.constant(item.prices))

    const tableFields = [
      {
        title: 'Date',
        key: 'time',
        render: ({time}) => {
          return moment(time).subtract(1, 'seconds').format('D.M.YYYY')
        }
      },
      {
        title: 'Price',
        key: 'price',
        render: ({price}) => <Gold value={price} />
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
      <div className="view">
        <div className="view-header">
          <div style={{float: 'right', lineHeight: '40px'}}>Market Value: <Gold big value={marketValue(item.prices)} /></div>
          <Item data={item} />
        </div>
        <div className="view-content">

          <div className="flex-box">
            <div className="flex-content flex-shrink">
              <Table className="listing compact" fields={tableFields} sortedBy={sortedBy$} data={sortedItems$} sortFn={sortFn} />
            </div>
            <div className="flex-content flex-grow">
              <ChartistGraph options={chartOptions} data={chartData} type={'Line'} />
            </div>
          </div>
        </div>
      </div>
    )
  })
)
