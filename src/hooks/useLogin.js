import { login as _login, refreshToken as _refreshToken } from "@/api"
import { getWalletClient, walletInfo} from "./useWallet"
import { signIn } from "./useSignIn"
import { setAuth, clearAuth, getRefreshToken } from "./useAuth"

export const login = async () => {
  const { origin } = walletInfo.value
  const { host } = new URL(origin)

  const walletClient = getWalletClient()
  const chainId = await walletClient.getChainId()
  const signData = await signIn({ walletClient }, chainId, host, origin).catch(err => {
    throw new Error("Login fail", { cause: err.shortMessage || err.details || err.message })
  })
  if (!signData) {
    return
  }

  const res = await _login(signData)
  if (res.code !== 0) {
    throw new Error("Login fail", { cause: res.message })
  }

  setAuth(res.data)
}

export const refreshToken = async () => {
  const res = await _refreshToken({ refreshToken: getRefreshToken() })
  if (res.code !== 0) {
    clearAuth()
    console.warn(`refresh token fail`)
    return false
  }

  setAuth(res.data)
  return true
}
