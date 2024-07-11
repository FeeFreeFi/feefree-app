import { fromValue } from "./bn"

/**
 * @param {number} price
 */
const formatPrice = price => {
  price = price || 0

  let dp
  if (price > 1000) {
    dp = 0
  } else if (price > 10) {
    dp = 3
  } else if (price > 1) {
    dp = 4
  } else {
    dp = 6
  }

  return fromValue(price).dp(dp).toFormat()
}

export default formatPrice
