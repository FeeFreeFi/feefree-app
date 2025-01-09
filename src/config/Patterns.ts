const UUID = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{8}$/
const Id = UUID
const Referral = UUID
const PoolId = /^0x[\da-f]{64}$/
const POOL_ID = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{44,}$/
const Address = /^0x[\da-fA-F]{40}$/

export const Patterns = {
  Id,
  Referral,
  PoolId,
  POOL_ID,
  Address,
}
