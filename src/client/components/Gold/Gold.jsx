import React from 'react'
import { classNames as cx } from 'utils'
import { asGold } from 'utils/gold'

export default ({ value, big, className }) => {
  const [ gold, silver, copper ] = asGold(value)

  return (
    <span className={cx(['gold', big ? 'big' : '', className])} title={`${gold.amount}g ${silver.amount}s ${copper.amount}c`}>
      {gold.amount !== 0 && (<span className="currency gold">{gold.amount}</span>)}
      {silver.amount !== 0 && (<span className="currency silver">{silver.amount}</span>)}
      {copper.amount !== 0 && (<span className="currency copper">{copper.amount}</span>)}
    </span>
  )
}
