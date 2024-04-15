import { waitForTransactionReceipt } from "./useClient"

/**
 * @param {import('naive-ui').NotificationProviderInst} notification
 * @param {{chainId:number, hash:string, explorerUrl:string}} tx
 * @param {string} title
 * @param {string} content
 */
export const waitTx = async (notification, tx, title, content) => {
  const { chainId, hash } = tx

  await waitForTransactionReceipt(chainId, hash)

  notification.success({
    title,
    content: content || "Confirmed",
    duration: 5000,
  })
}
