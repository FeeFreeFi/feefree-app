import { getChainName } from './useChains'
import { getPublicClient, waitForTransactionReceipt } from './useClient'
import { allowance, approve } from './useCurrency'
import { exchange, isExchangeToken } from './useSwap'
import { mint } from './useNft'
import { getRouterAddress } from './useRouter'
import { addLiquidity, removeLiquidity, swap } from './useSwap'
import { getWalletClient, switchChain } from './useWallet'
import { claim, getClaimAddress } from './useReward'

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
 * @param {import('vue').Ref<boolean>} checking
 * @param {() => Promise} check
 */
export const doCheckApproval = async (checking, check) => {
  checking.value = true
  await check()
  checking.value = false
}

/**
 * @param {import('vue').Ref<boolean>} approved
 * @param {import('@/types').Token} token
 * @param {string} owner
 * @param {string} spender
 * @param {bigint} amount
 */
export const doCheckAllowance = async (approved, token, owner, spender, amount) => {
  const publicClient = getPublicClient(token.chainId)
  const allowed = await allowance(publicClient, token.address, owner, spender).catch(() => 0n)
  approved.value = allowed >= amount
}

/**
 * @param {import('vue').Ref<import('@/types').ApprovalAction>} action
 * @param {import('vue').Ref<boolean>} approving
 * @param {import('@/types').Token} token
 * @param {string} spender
 * @param {bigint} amount
 */
export const doApproval = async (action, approving, token, spender, amount) => {
  const { address, chainId } = token
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Unlocking`,
      data: { token, amount },
    }
    approving.value = true
    const tx = await approve(
      { publicClient, walletClient },
      address,
      spender,
      amount,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    approving.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Unlock success`,
    }

    return true
  } catch (err) {
    approving.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Unlock fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').SwapAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @param {import('@/types').SwapQuoteData} quoteData
 * @param {string} to
 * @param {bigint} fee
 */
export const doSwap = async (action, loading, inputToken, outputToken, quoteData, to, fee) => {
  const { chainId } = inputToken
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getRouterAddress(chainId)
  const { paths, sqrtPriceX96Afters, amountIn, amountOut, amountSpecified } = quoteData

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Swaping for`,
      data: { inputToken, outputToken, amountIn, amountOut, fee },
    }
    loading.value = true
    const tx = await swap(
      { publicClient, walletClient },
      address,
      paths,
      sqrtPriceX96Afters,
      amountIn,
      amountSpecified,
      to,
      fee
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Swap success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Swap fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').ExchangeAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @param {bigint} amount
 * @param {string} to
 * @param {bigint} fee
 */
export const doExchange = async (action, loading, inputToken, outputToken, amount, to, fee) => {
  const { chainId } = inputToken
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getRouterAddress(chainId)
  const isInputExchange = isExchangeToken(inputToken)
  const amountSpecified = isInputExchange ? amount : -amount
  const token = isInputExchange ? outputToken : inputToken

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Swaping`,
      data: { inputToken, outputToken, amountIn: amount, amountOut: amount, fee },
    }
    loading.value = true
    const tx = await exchange(
      { publicClient, walletClient },
      address,
      token.address,
      amountSpecified,
      to,
      fee,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Swap success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Swap fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').DepositAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Pool} pool
 * @param {bigint} amount0
 * @param {bigint} amount1
 * @param {import('@/types').DepositQuoteData} quoteData
 */
export const doDeposit = async (action, loading, pool, amount0, amount1, quoteData) => {
  const { chainId, currency0, currency1 } = pool
  const { amount0Min, amount1Min } = quoteData
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getRouterAddress(chainId)

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Depositing for`,
      data: { currency0, currency1, amount0, amount1 },
    }
    loading.value = true
    const tx = await addLiquidity(
      { publicClient, walletClient },
      address,
      currency0.address,
      currency1.address,
      amount0,
      amount1,
      amount0Min,
      amount1Min,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Deposit success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Deposit fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').WithdrawAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Pool} pool
 * @param {bigint} liquidity
 * @param {import('@/types').WithdrawQuoteData} quoteData
 */
export const doWithdraw = async (action, loading, pool, liquidity, quoteData) => {
  const { chainId, currency0, currency1 } = pool
  const { amount0, amount1 } = quoteData
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getRouterAddress(chainId)

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Withdrawing for`,
      data: { currency0, currency1, liquidity, amount0, amount1 },
    }
    loading.value = true
    const tx = await removeLiquidity(
      { publicClient, walletClient },
      address,
      currency0.address,
      currency1.address,
      liquidity,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Withdraw success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Withdraw fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').MintAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Nft} nft
 * @param {string} to
 */
export const doMint = async (action, loading, nft, to) => {
  const { address, chainId, price } = nft
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Minting`,
      data: { nft },
    }
    loading.value = true
    const tx = await mint(
      { publicClient, walletClient },
      address,
      to,
      price,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Mint success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Mint fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}

/**
 * @param {import('vue').Ref<import('@/types').ClaimAction>} action
 * @param {import('vue').Ref<boolean>} loading
 * @param {import('@/types').Reward} reward
 * @param {string} to
 */
export const doClaim = async (action, loading, reward, to) => {
  const { chainId, amount, nonce, proof, root } = reward
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const amountValue = BigInt(amount)
  const address = getClaimAddress(chainId)

  try {
    action.value = {
      show: true,
      state: "initial",
      title: `Claiming`,
      data: { chainId, amount: amountValue, nonce, proof, root },
    }
    loading.value = true
    const tx = await claim(
      { publicClient, walletClient },
      address,
      amountValue,
      to,
      nonce,
      proof,
    )
    action.value = {
      ...action.value,
      state: "pending",
      tx,
    }
    // TODO parse transaction receipt
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    loading.value = false
    action.value = {
      ...action.value,
      state: "success",
      title: `Claim success`,
    }

    return true
  } catch (err) {
    loading.value = false
    action.value = {
      ...action.value,
      state: "fail",
      title: `Claim fail`,
      error: err.shortMessage || err.details || err.message,
    }

    return false
  }
}
