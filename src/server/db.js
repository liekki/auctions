import Promise from 'bluebird'
import _ from 'lodash'
import itemNameMapping from './domain/items'
import suffixMapping from './domain/suffixes'
import suffixNameTransformer from './domain/suffixNames'

import {
  ACTION_UPDATE,
  ACTION_INSERT,
  ACTION_IGNORE
} from 'constants'

const MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient
let db,db2

MongoClient.connectAsync('mongodb://mongo:27017/ah')
  .then(database => {
    db = database
 })

MongoClient.connectAsync('mongodb://mongo:27017/ah') // another connection for big ass inserts (FIXME)
  .then(database => {
    db2 = database
 })

const findRecord = (record) => {
  return db.collection('items').findOneAsync({
    'item.id': record.item,
    server: record.server,
    faction: record.faction,
    rand: record.rand
  })
}

const findAll = () => {
  return db.collection('items').find({ server: 'Nostalrius PvP' })
}

const findRecordsByName = (str, limit = 5) => {
  const nameRegex = new RegExp(`${str}`, 'i')
  return db.collection('items').findAsync({ 'fullName': nameRegex, prices: { $exists: true, $not: { $size: 0 } }, server: 'Nostalrius PvP' })
}

const findRecordById = (id, suffix = 0) => {
  return db.collection('items').findOneAsync({ id, rand: suffix, prices: { $exists: true, $not: { $size: 0 } }, server: 'Nostalrius PvP' })
}

const upsertRecord = (data) => {

  if(!foundInMapping(data))
    return Promise.resolve({ id: data.item, type: ACTION_IGNORE })

  const enriched = enrichRecordData(data)

  return db2.collection('items').updateOneAsync({
    id: enriched.id,
    fullName: enriched.fullName,
    item: enriched.item,
    server: enriched.server,
    faction: enriched.faction,
    suffix: enriched.suffix,
    rand: enriched.rand
  }, {
    $addToSet: { prices: { $each: enriched.prices } }
  }, { upsert: true }).then(res => {
    return Promise.resolve({ id: data.item, type: ACTION_UPDATE })
  })
}

const enrichRecordData = (record) => {
  const suffixId = parseInt(record.rand, 10)
  const suffixModifiers = suffixId ? suffixMapping[suffixId] : null
  const suffixName = suffixModifiers ? suffixNameTransformer(suffixId, suffixModifiers) : ''
  const item = _.find(itemNameMapping, { id: record.item })

  const suffix = suffixId ? {
     name: suffixName,
    modifiers: suffixModifiers
  } : null

  if(typeof item === 'undefined')
    console.log('wtf?', record) // eslint-disable-line no-console

  const fullName = suffix ? `${item.name} ${suffix.name}` : item.name

  return {
    ...record,
    id: item.id,
    fullName,
    item,
    suffix
  }
}

const foundInMapping = (record) => !!_.find(itemNameMapping, { id: record.item })

export {
  findAll,
  findRecord,
  findRecordById,
  findRecordsByName,
  upsertRecord
}
