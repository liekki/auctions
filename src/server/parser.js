import Promise from 'bluebird'
import luaparser from 'luaparse'
import _ from 'lodash'
import { isValidJson } from 'utils'
import moment from 'moment'

export const parseLua = (lua) => {
  return new Promise((resolve, reject) => {
    try {
      const json = luaparser.parse(lua)
      if(isValidJson(json))
        return resolve(json)
      else
        return reject('invalid json format')
    } catch(err) {
      return reject(err)
    }
  })
}

export const parse = (lua) => {
  return parseLua(lua)
    .then(data => {
      const payload = data.body[0].init[0].fields

      return _.flatten(payload.map(parseServerData))
    })

  function parseServerData(data) {
    const header = _.get(data, 'key.value', '').split('|')
    const items = _.get(data, 'value.fields[1].value.fields', [])
      .map(parseItemData)
      .map(item => ({...item, server: header[0], faction: header[1]}))

    return items
  }

  function parseItemData(data) {
    const header = _.get(data, 'key.value', '').split(':')
    const prices = _.get(data, 'value.value', '')
    const slices = prices.split('#')

    const current = {
      time: moment.unix(slices[0]).toDate(),
      price: slices[1]
    }

    const history = slices[3]
      .split(';')
      .filter(_.identity)
      .map(str => {
        const d = str.split('@')
        return {
          time: moment.unix(d[1]).toDate(),
          price: d[0]
        }
      })
      .filter(p => !_.isEmpty(p.price))

    const combinedPrices = []
      .concat([current])
      .concat(history)
      .filter(p => !_.isEmpty(p.price))

    return {
      item: header[0],
      rand: header[1],
      prices: combinedPrices
    }
  }
}
