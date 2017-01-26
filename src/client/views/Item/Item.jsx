import React from 'karet'
import { waitForPromises, withUnmount$ } from 'utils/containers'
import moment from 'moment'
import R from 'ramda'
import * as api from 'api'

import { Item, Gold } from 'components'
import { marketValue } from 'utils'
import { asGold } from 'utils/gold'

import Chartist from 'chartist'
import ChartistTooltips from 'chartist-plugin-tooltips'
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
          return asGold(value).filter(R.identity).map((val, idx) => {
            const types = ['g', 's', 'c']
            return `${val}${types[idx]}`
          }).join(' ')
        }
      },
      reverseData: false,
      plugins: [
        Chartist.plugins.tooltip({
          anchorToPoint: true,
          transformTooltipTextFnc: (value) => {
            return value ? asGold(value).filter(R.identity).map((val, idx) => {
              const types = ['g', 's', 'c']
              return `${val}${types[idx]}`
            }).join(' ') : ''
          }
        })
      ]
    }
    return (
      <div className="view">
        <div className="view-header">
          <div style={{float: 'right', lineHeight: '40px'}}>Market Value: <Gold big value={marketValue(item.prices)} /></div>
          <Item data={item} />
        </div>
        <div className="view-content">

          <div className="flex-box">
            <div className="flex-content flex-shrink">

              <table className="listing">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {item.prices.map((p, idx) => (
                    <tr key={idx}>
                      <td>{moment(p.time).subtract(1, 'seconds').format('D.M.YYYY')}</td>
                      <td><Gold value={p.price} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
