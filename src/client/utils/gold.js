const SILVER_IN_COPPER = 100
const GOLD_IN_COPPER = 10000

export const asGold = (value) => {
  const gold = Math.floor(value / GOLD_IN_COPPER)
  const silver = Math.floor((value - gold * GOLD_IN_COPPER) / SILVER_IN_COPPER)
  const copper = value - silver * SILVER_IN_COPPER - gold * GOLD_IN_COPPER

  return [{amount: gold, type: 'gold'}, {amount: silver, type: 'silver'}, {amount: copper, type: 'copper'}]
}
