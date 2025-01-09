import { fromValue } from "./bn"

export const formatPrice = (price: number, dp: number|undefined = undefined) => {
  price = price || 0

  if (dp === undefined) {
    if (price > 1000) {
      dp = 0
    } else if (price > 10) {
      dp = 3
    } else if (price > 1) {
      dp = 4
    } else {
      dp = 6
    }
  }

  return fromValue(price).dp(dp).toFormat()
}
