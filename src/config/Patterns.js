const UUID = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{8}$/
const Id = UUID
const Referral = UUID
const PoolId = /^0x[\d[a-f]]{64}$/

export const Patterns = {
  Id,
  Referral,
  PoolId,
}
