import fs from 'fs'
import Promise from 'bluebird'

Promise.promisifyAll(fs)

export const readFile = filename => {
  return fs.readFileAsync(filename, 'utf-8')
}

export const isValidJson = json => {
  try {
      const str = JSON.stringify(json)
      JSON.parse(str)
  } catch (e) {
      return false
  }
  return true
}

export const apiResponse = (res, status, data, error) => {
  res.send({
    status,
    data,
    error
  }).status(status)
}
