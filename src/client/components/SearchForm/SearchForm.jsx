import React from 'karet'
import Kefir from 'kefir'
import { createAction } from 'utils'
import R from 'ramda'
import K, * as U from 'karet.util'

import * as api from 'api'

import { navigateTo } from 'actions'
import { Link } from 'react-router'

export default () => {
  const [ change, onChange$ ] = createAction()
  const [ keyDown, onKeyDown$ ] = createAction((event) => {
    if(event.keyCode === 38 || event.keyCode === 40)
      event.preventDefault()
    return event.keyCode
  })
  const [ submit, onSubmit$ ] = createAction()

  const text$ = onChange$
    .toProperty(R.always(''))

  const isEmpty$ = onChange$
    .filter(R.isEmpty)
    .map(R.always(true))
    .toProperty(R.always(true))

  const suggestions$ = onChange$
    .debounce(200)
    .filter(R.identity)
    .flatMapLatest(str =>
      Kefir.fromPromise(api.findSuggestionsByName(str).then(results => results && results.length ? results : null))
    )
    .merge(isEmpty$.map(R.always(null)))
    .toProperty(R.always(null))

  const isLoading$ = onChange$
    .map(string => !!string.length)
    .merge(suggestions$.map(R.always(false)).skip(1))
    .merge(isEmpty$.map(R.always(false)))
    .toProperty(R.always(false))

  const arrow$ = onKeyDown$
    .filter(key => key === 38 || key === 40)
    .map(key => key === 38 ? -1 : 1)

  const selectedSuggestion$ = suggestions$.filter(R.identity)
    .flatMapLatest(suggestions =>
      Kefir
        .constant()
        .merge(onKeyDown$.filter(key => key === 27))
        .map(R.always(suggestions)))
    .flatMapLatest(suggestions =>
      arrow$.scan((prev, direction) => {
        const idx = R.clamp(0, suggestions.length-1, prev.idx ? prev.idx + direction : direction)
        return { idx, suggestions }
      }, { idx: -1, suggestions }))
    .map(res => {
      if(res.idx >= 0)
        return res.suggestions[res.idx]
      else if(res.suggestions && res.suggestions.length === 1)
        return res.suggestions[0]
      else
        return false
    })
    .skipDuplicates()
    .toProperty(R.always(false))

  const redirectPath$ = text$
    .filter(R.length)
    .merge(selectedSuggestion$.filter(Boolean))
    .map(res => {
      if(typeof res === 'object')
        return `/item/${res.id}/${res.rand}`
      else
        return `/search/${res}`
    })
    .toProperty(R.always(false))

  redirectPath$
    .sampledBy(onSubmit$)
    .filter(R.identity)
    .onValue(path => {
      navigateTo(path)
    })

  const placeholderText = 'Search for items e.g. "Arcane Crystal"'

  return (
    <div className="searchForm">
      <form onSubmit={(e) => { e.preventDefault(); submit(e)}}>
        <input
          {...U.classes(U.ift(isLoading$, 'loading'))}
          id="searchForm"
          type="text"
          placeholder={placeholderText}
          value={text$}
          onKeyDown={(evt) => keyDown(evt)}
          onChange={(evt) => change(evt.target.value)}
          autoComplete="off" />
        {U.ift(suggestions$, (
          <ul className="suggestions">
            {U.seq(suggestions$, U.defaultTo([]), U.mapIndexed((s, idx) => (
              <li {...U.classes('suggestion', K(selectedSuggestion$, suggestion => suggestion === s ? 'selected' : ''), `q${s.item.quality}`)} key={idx}>
                <Link to={`/item/${s.item.id}/${s.rand}`}>
                  <div className={`icon ${s.item.icon}`} style={{backgroundImage: 'url(/static/img/icons/large/'+s.item.icon+'.png)' }} />
                  <span className="name">{s.item.name}{s.suffix && R.concat(' ', s.suffix.name)}</span>
                  {s.suffix && (<span className="modifiers">({R.drop(1, R.replace(/([^+%0-9]|5\ssec)/g, '', s.suffix.modifiers).split('+'))
  .map(R.concat('+')).join('/')})</span>)}
                </Link>
              </li>
            )))}
          </ul>
        ))}
      </form>
    </div>
  )
}
