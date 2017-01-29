import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import config from 'nconf'
import multer from 'multer'
import Promise from 'bluebird'
import compression from 'compression'
import favicon from 'serve-favicon'

import auth from './auth'
import { readFile, apiResponse } from 'utils'
import { parse } from './parser'
import { findRecordById, findRecordsByName, upsertRecord } from './db'


import {
  ACTION_UPDATE,
  ACTION_INSERT,
  ACTION_IGNORE
} from 'constants'

config.argv().env().file({file: './config.json'})

const APP_PORT = process.env.APP_PORT || config.get('server').port
const APP_PATH = process.env.APP_PATH || path.resolve(__dirname + '/../../dist/client')

const app = express()

app.use('/static', compression(), express.static(APP_PATH))
app.use(favicon(APP_PATH + '/img/favicon.ico'))

app.use(bodyParser.json())

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/v1/item/:id/:suffix', (req, res, next) => {
  findRecordById(req.params.id, req.params.suffix)
    .then(result => apiResponse(res, 200, result, null))
    .catch(err => apiResponse(res, 500, null, err))
})

app.get('/api/v1/suggestions/:name', (req, res, next) => {
  findRecordsByName(req.params.name)
    .then(cursor => cursor.sort({name: 1, 'item.quality': -1}).limit(5).toArray())
    .then(result => apiResponse(res, 200, result, null))
    .catch(err => apiResponse(res, 500, null, err))
})

app.get('/api/v1/items/:name', (req, res, next) => {
  findRecordsByName(req.params.name)
    .then(cursor => cursor.sort({name: 1, 'item.quality': -1}).limit(100).toArray())
    .then(result => apiResponse(res, 200, result, null))
    .catch(err => apiResponse(res, 500, null, err))
})

app.get('/upload', auth, (req, res, next) => {
  readFile('./src/server/templates/upload.html').then(html => res.send(html))
})

app.post('/upload', [auth, upload.single('records')], (req, res, next) => {
  Promise.resolve(req.file.buffer.toString('utf-8'))
    .then(parse)
    .then(data => Promise.all(data.map(upsertRecord)))
    .then(actions => ({
      updated: actions.filter(a => a.type === ACTION_UPDATE).length,
      inserted: actions.filter(a => a.type === ACTION_INSERT).length,
      ignored: actions.filter(a => a.type === ACTION_IGNORE).length
    }))
    .then(result => {
      console.log("\n", result);
      return result
    })
    .then(result => apiResponse(res, 200, result, null))
    .catch(err => apiResponse(res, 500, null, err))
})

app.use('/', (req, res) => res.sendFile(APP_PATH + '/index.html'))


app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`)
})
