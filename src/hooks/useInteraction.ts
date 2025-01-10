import type { Ref } from 'vue'
import type { NotificationProviderInst } from 'naive-ui'
import type { ApprovalAction, ModalAction, Token, Tx } from '@/types'
import { States } from '@/config'
import { getChainName } from './useChains'
import { switchChain } from './useWallet'
import { approve } from './useToken'
import { waitForTransactionReceipt } from './useClient'
import { getErrorMessage } from '@/utils'

export const doSwitchNetwork = async (notification: NotificationProviderInst, chainId: number) => {
  try {
    await switchChain(chainId)
    return true
  } catch (err: unknown) {
    notification.error({
      title: `Switch to ${getChainName(chainId)} fail`,
      content: getErrorMessage(err, 'Switch chain error'),
      duration: 5000,
    })

    return false
  }
}

export const doSend = async (action: Ref<ModalAction>, loading: Ref<boolean>, title: string, sendTx: () => Promise<Tx>) => {
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
  } catch (err: unknown) {
    loading.value = false
    action.value.state = States.FAIL
    action.value.error = getErrorMessage(err, 'Internal error')

    return false
  }
}

export const doApproval = async (action: Ref<ApprovalAction>, loading: Ref<boolean>, token: Token, spender: string, amount: bigint) => {
  action.value.data = { chainId: token.chainId, token, amount, spender }

  return doSend(action, loading, 'Approve', () => approve(token, spender, amount))
}
