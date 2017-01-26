import React from 'react'

export default React.createClass({
  render() {
    let set = this.props.set

    return (
      <div className="item-set">
        <p style={{marginTop: 10}} className="q">{set.name}</p>
        {set.items && set.items.map((item) => {
          return <p style={{marginLeft: 10}} className={item.equipped ? 'q8' : 'q0'} key={'itemset-'+this.props.set.name+'-item-'+item.name}>{item.name}</p>
        })}

        <div className="item-set-bonuses" style={{marginTop: 10}}>
          {set.bonuses && set.bonuses.map((bonus, idx) => {
            return <p className={set.equipped >= bonus.items ? 'q2' : 'q0'} key={'itemset-bonus-'+idx}>({bonus.items}) Set: {bonus.text}</p>
          })}
        </div>
      </div>
    )
  }
})
