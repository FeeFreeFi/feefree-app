import { ref, readonly } from "vue"

const connectingWalletRef = ref(null)
const rejectedRef = ref(false)

export const reject = () => {
  rejectedRef.value = true
}

export const reset = () => {
  connectingWalletRef.value = null
  rejectedRef.value = false
}

export const connecting = wallet => {
  connectingWalletRef.value = wallet
  rejectedRef.value = false
}

const readonlyConnectingWallet = readonly(connectingWalletRef)
const readonlyRejected = readonly(rejectedRef)

export {
  readonlyConnectingWallet as connectingWallet,
  readonlyRejected as rejected,
}
