import React from 'react'
import { classNames as cx } from 'utils'
import { asGold } from 'utils/gold'

export default ({ value, big, className }) => {
  const [ gold, silver, copper ] = asGold(value)

  return (
    <span className={cx(['gold', big ? 'big' : '', className])} title={`${gold}g ${silver}s ${copper}c`}>
      {gold !== 0 && (<span className="currency gold">{gold}</span>)}
      {silver !== 0 && (<span className="currency silver">{silver}</span>)}
      {copper !== 0 && (<span className="currency copper">{copper}</span>)}
    </span>
  )
}
