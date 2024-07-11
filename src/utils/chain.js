/**
 * @param {string} address
 * @param {string} explorerUrl
 */
export const getTransactionUrl = (hash, explorerUrl) => {
  return `${explorerUrl}/tx/${hash}`
}

/**
 * @param {string} address
 * @param {string} explorerUrl
 */
export const getContractUrl = (address, explorerUrl) => {
  return `${explorerUrl}/address/${address}`
}

/**
 * @param {string} address
 * @param {string} explorerUrl
 */
export const getTokenUrl = (address, explorerUrl) => {
  return `${explorerUrl}/token/${address}`
}

/**
 * @param {string} account
 * @param {string} explorerUrl
 */
export const getAccountUrl = (account, explorerUrl) => {
  return `${explorerUrl}/address/${account}`
}

/**
 * @param {string} hash
 * @param {{id:number, blockExplorers: {default: {url:string}}}} chain
 */
export const getTxMeta = (hash, chain) => {
  const { id: chainId, blockExplorers } = chain
  const explorerUrl = getTransactionUrl(hash, blockExplorers.default.url)

  return { hash, chainId, explorerUrl }
}
