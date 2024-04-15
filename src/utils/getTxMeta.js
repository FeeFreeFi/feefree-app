/**
 * @param {string} hash
 * @param {{id:number, blockExplorers: {default: {url:string}}}} chain
 */
export const getTxMeta = (hash, chain) => {
  const { id, blockExplorers } = chain
  let url = blockExplorers.default.url
  url = url.endsWith("/") ? url.slice(0, -1) : url

  return {
    hash,
    chainId: id,
    explorerUrl: `${url}/tx/${hash}`
  }
}
