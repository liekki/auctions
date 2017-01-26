import R from 'ramda'

export default function (prices) {
  return Math.round(R.median(R.take(10, prices).map(p => parseInt(p.price))))
}
