import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import _ from 'lodash'

import ItemSet from './ItemSet.jsx'

export default React.createClass({
  render() {
    const item = this.props.item

    const itemClasses = cx({
      'item-tooltip': true,
      ['q-'+item.quality]: true
    })

    const isWeapon = item.dmg_min && item.dmg_max && true
    const dps = isWeapon && Math.round((item.dmg_min+item.dmg_max)/2/(item.weapon_speed/1000)*10)/10

    const itemClass = item.class.replace(/([a-z]+)_(1h|2h)/, "$1")

    return (
      <div className={itemClasses}>
        <div className="icon" style={{backgroundImage: `url(/static/img/icons/large/${item.icon.toLowerCase()}.png)`}} />
        <table>
          <tbody>
            <tr>
              <th className="tooltip-content">

                <h2 className={"q"+item.quality}>{item.name}</h2>

                <p style={{'clear': 'both', float: 'right'}}>{itemClass.replace(/_/, ' ').capitalizeFirstLetter()}</p>

                <p>{item.type.capitalizeFirstLetter()}</p>

                {item.dmg_min && item.dmg_max && (
                  <div>
                    <p className="clearfix"><span style={{float: 'right'}}>Speed {item.weapon_speed/1000}</span>{item.dmg_min} - {item.dmg_max} Damage</p>
                    <p>({dps} damage per second)</p>
                  </div>
                )}

                {item.armor && <p>{item.armor} Armor</p>}

                {item.modifiers && _.map(item.modifiers, (amount, stat) => {
                  if(['stamina', 'strength', 'agility', 'spirit', 'intellect'].indexOf(stat) != -1)
                    return (<p key={'item-'+item.entry+'-modifier-'+stat}>+{amount} {stat.capitalizeFirstLetter()}</p>)
                })}

                {this.props.suffix && <p>{this.props.suffix.modifiers}</p>}


                {item.modifiers && _.map(item.modifiers, (amount,stat) => {
                  let resistance;
                  if(resistance = stat.match(/^resistance_([a-z]+)$/))
                    return (<p key={'item-'+item.entry+'-modifier-'+stat}>+{amount} {resistance[1].capitalizeFirstLetter()} Resistance</p>)
                })}

                <p className="q2">{item.enchant && item.enchant.text}</p>

                {item.durability !== 0 && <p>Durability {item.durability} / {item.durability}</p>}

                {item.required_level !== 0 && <p>Required Level {item.required_level}</p>}

                {item.modifiers && _.map(item.modifiers, (amount, stat) => {
                  let weaponSkill = stat.match(/weaponskill_(.+)/)

                  if(weaponSkill)                 return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increased {weaponSkill[1].capitalizeFirstLetter()}s +{amount}.</p>)
                  if(stat === 'ap')               return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: +{amount} Attack Power.</p>)
                  if(stat === 'dodge')            return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Improves your chance to dodge by {amount}%.</p>)
                  if(stat === 'hit')              return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Improves your chance to hit by {amount}%.</p>)
                  if(stat === 'crit')             return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Improves your chance to get a critical strike by {amount}%.</p>)
                  if(stat === 'defense')          return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increased Defense +{amount}.</p>)
                  if(stat === 'hp5')              return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Restores {amount} health per 5 sec.</p>)
                  if(stat === 'mp5')              return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Restores {amount} mana per 5 sec.</p>)
                  if(stat === 'block')            return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases your chance to block attacks with a shield by {amount}%.</p>)
                  if(stat === 'blockvalue')       return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Increases the block value of your shield by {amount}.</p>)
                  if(stat === 'parry')            return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases your chance to parry an attack by {amount}%.</p>)

                  if(stat === 'spell_dmg')        return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage and healing done by magical spells and effects by up to {amount}.</p>)
                  if(stat === 'spell_hit')        return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Improves your chance to hit with spells by {amount}%.</p>)
                  if(stat === 'spell_crit')       return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Improves your chance to get a critical strike with spells by {amount}%.</p>)

                  if(stat === 'spell_dmg_frost')  return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage done by Frost spells and effects by up to {amount}.</p>)
                  if(stat === 'spell_dmg_fire')   return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage done by Fire spells and effects by up to {amount}.</p>)
                  if(stat === 'spell_dmg_arcane') return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage done by Arcane spells and effects by up to {amount}.</p>)
                  if(stat === 'spell_dmg_shadow') return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage done by Shadow spells and effects by up to {amount}.</p>)
                  if(stat === 'spell_dmg_nature') return (<p className="q2" key={'item-'+item.entry+'-modifier-'+stat}>Equip: Increases damage done by Nature spells and effects by up to {amount}.</p>)
                })}

                {_.map(item.spells, (spell, idx) => {
                  return (<p className="q2" key={'item-'+item.entry+'-spell-'+idx}>Equip: {spell}</p>)
                })}

                {item.itemset && <ItemSet set={item.itemset} />}

              </th>
              <td className="tooltip-content-right">&nbsp;</td>
            </tr>
            <tr>
              <td className="tooltip-content-bottomleft"></td>
              <td className="tooltip-content-bottomright"></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
})

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
