import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'
import R from 'ramda'
import { groupPricesByTime } from 'utils'

export const findSuggestionsByName = (str) =>
  fetch(`${process.env.SITE_URL}/api/v1/suggestions/${str}`)
    .then(res => res.json())
    .then(response => {
      if(response.status != 'error')
        return response.data
      else Promise.reject('Failed to fetch data from the API')
    })

export const findItemById = (id, suffix) =>
  fetch(`${process.env.SITE_URL}/api/v1/item/${id}/${suffix}`)
    .then(res => res.json())
    .then(response => {
      if(response.status != 'error')
        return response.data
      else Promise.reject('Failed to fetch data from the API')
    })
    .then(data => ({
      ...data,
      prices: groupPricesByTime(data.prices)
    }))
    .catch(err => {
      console.log(err)
    })

export const findItemsByName = (str) =>
  fetch(`${process.env.SITE_URL}/api/v1/items/${str}`)
    .then(res => res.json())
    .then(response => {
      if(response.status != 'error')
        return response.data
      else Promise.reject('Failed to fetch data from the API')
    })
    .then(results => results.map(data => {
      return {
        ...data,
        prices: groupPricesByTime(data.prices)
      }
    }))
/*
export const getItemDetailsById = (id) =>
  fetch(`http://localhost:8100/v1/item?id=${id}`)
    .then(res => res.json())
    .then(response => {
      if(response.status != 'error')
        return response.data
      else Promise.reject('Failed to fetch data from the API')
    })
*/
