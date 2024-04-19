import { getChainName } from './useChains'
import { getPublicClient } from './useClient'
import { allowance, approve } from './useCurrency'
import { waitTx } from './useWaitTx'
import { getWalletClient, switchChain } from './useWallet'

/**
 * @param {import('naive-ui').NotificationProviderInst} notification
 * @param {import('vue').Ref<boolean>} switching
 * @param {number} chainId
 */
export const doSwitchNetwork = async (notification, switching, chainId) => {
  try {
    switching.value = true
    await switchChain(chainId)
    switching.value = false

    return true
  } catch (err) {
    switching.value = false
    notification.error({
      title: `Switch to ${getChainName(chainId)} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })

    return false
  }
}

/**
 * @param {string} checking
 * @param {() => Promise} check
 */
export const doCheckApproval = async (checking, check) => {
  checking.value = true
  await check()
  checking.value = false
}

/**
 * @param {import('vue').Ref<boolean>} approved
 * @param {{chainId:number, address:string, symbol:string}} token
 * @param {string} owner
 * @param {address} spender
 * @param {bigint} amount
 */
export const doCheckAllowance = async (approved, token, owner, spender, amount) => {
  const publicClient = getPublicClient(token.chainId)
  const allowed = await allowance(publicClient, token.address, owner, spender).catch(() => 0n)
  approved.value = allowed >= amount
}

/**
 * @param {import('naive-ui').NotificationProviderInst} notification
 * @param {import('vue').Ref<boolean>} approving
 * @param {{chainId:number, address:string, symbol:string}} token
 * @param {address} spender
 * @param {bigint} amount
 */
export const doApproval = async (notification, approving, token, spender, amount) => {
  const { symbol, address, chainId } = token
  try {
    const publicClient = getPublicClient(chainId)
    const walletClient = getWalletClient()

    approving.value = true
    const tx = await approve(
      { publicClient, walletClient },
      address,
      spender,
      amount,
    )
    await waitTx(notification, tx, 'Success', `Unlock ${symbol}`)
    approving.value = false

    return true
  } catch (err) {
    approving.value = false
    notification.error({
      title: `Unlock ${symbol} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })

    return false
  }
}
