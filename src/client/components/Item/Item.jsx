import React from 'react'
import { Link } from 'react-router'

export default ({data}) => {
  return (
    <div className="item">
      <Link to={`/item/${data.id}/${data.rand}`}>
        <span className='icon' style={{ backgroundImage: `url(/static/img/icons/large/${data.item.icon}.png)`}} />
        <span className={`name q${data.item.quality}`}>{data.fullName}</span>
        {data.suffix && <span className="modifiers">{data.suffix.modifiers}</span>}
      </Link>
    </div>
  )
}
