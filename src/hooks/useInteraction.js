import { States } from "@/config"
import { getChainName } from './useChains'
import { switchChain } from './useWallet'
import { approve } from "./useToken"
import { waitForTransactionReceipt } from './useClient'

/**
 * @param {import('naive-ui').NotificationProviderInst} notification
 * @param {number} chainId
 */
export const doSwitchNetwork = async (notification, chainId) => {
  try {
    await switchChain(chainId)
    return true
  } catch (err) {
    notification.error({
      title: `Switch to ${getChainName(chainId)} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').ModalAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {string} title
 * @param {() => Promise<import('@/types').Tx>} sendTx
 */
export const doSend = async (action, loading, title, sendTx) => {
  try {
    loading.value = true

    action.value.title = title
    action.value.state = States.INITIAL
    action.value.show = true

    const tx = await sendTx()
    action.value.state = States.PENDING
    action.value.tx = tx
    await waitForTransactionReceipt(tx.chainId, tx.hash)

    loading.value = false
    action.value.state = States.SUCCESS

    return true
  } catch (err) {
    loading.value = false
    action.value.state = States.FAIL
    action.value.error = err.shortMessage || err.details || err.message

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').ApprovalAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Token} token
 * @param {string} spender
 * @param {bigint} amount
 */
export const doApproval = async (action, loading, token, spender, amount) => {
  action.value.data = { chainId: token.chainId, token, amount, spender }

  return doSend(action, loading, "Approve", () => approve(token, spender, amount))
}
