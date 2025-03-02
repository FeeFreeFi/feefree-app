<template>
  <ZContainer class="flex flex-col">
    <div class="flex sm:flex-row flex-col justify-start sm:justify-between gap-4 sm:gap-0 mb-4">
      <div class="flex items-center gap-3">
        <i-ff-migration class="size-5 sm:size-6" />
        <n-text>Migrate</n-text>
      </div>
    </div>
    <div v-if="config" class="justify-items-center gap-y-4 sm:gap-y-8 sm:gap-x-8 md:gap-x-32 lg:gap-x-14 xl:gap-x-8 2xl:gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <div v-if="poolOld" class="relative flex flex-col bg-card rounded-lg w-full sm:w-[272px] max-w-[311px]">
        <div class="relative flex justify-center rounded-t-lg w-full h-[78px] overflow-hidden">
          <img class="w-[311px] max-w-max h-[78px] pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="top-1 right-1 absolute size-4" :chain-id="poolOld.chainId" />
        </div>
        <div class="top-[65px] left-4 sm:left-6 absolute">
          <ZPoolIcon :pool="poolOld" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pt-8 pb-6">
          <div class="flex-y-center gap-2">
            <ZPoolName :pool="poolOld" />
            <n-text depth="1">Old</n-text>
          </div>
          <div class="flex justify-between mt-4 sm:mt-6 text-xs">
            <n-text depth="1">Liquidity</n-text>
            <ZBalance :value="liquidityOldBalance" :decimals="0" :dp="0" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="poolOld.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="flex-1 h-10 shrink-0" :disabled="!!loading || !liquidityOldBalance" :loading="loading === ACTION_WITHDRAW_OLD" aria-label="Withdraw" @click="() => onWithdrawLiquidity(false)">Withdraw</ZButton>
              <ZButton class="flex-1 h-10 shrink-0" :disabled="!!loading || !liquidityOldBalance" :loading="loading === ACTION_MIGRATE_OLD" aria-label="Migrate" @click="() => onMigrateLiquidity(false)">Migrate</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>

      <div class="relative flex flex-col bg-card rounded-lg w-full sm:w-[272px] max-w-[311px]">
        <div class="relative flex justify-center rounded-t-lg w-full h-[78px] overflow-hidden">
          <img class="w-[311px] max-w-max h-[78px] pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="top-1 right-1 absolute size-4" :chain-id="poolLegacy!.chainId" />
        </div>
        <div class="top-[65px] left-4 sm:left-6 absolute">
          <ZPoolIcon :pool="poolLegacy!" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pt-8 pb-6">
          <div class="flex-y-center gap-2">
            <ZPoolName :pool="poolLegacy!" />
            <n-text depth="1">Legacy</n-text>
          </div>
          <div class="flex justify-between mt-4 sm:mt-6 text-xs">
            <n-text depth="1">Liquidity</n-text>
            <ZBalance :value="liquidityLegacyBalance" :decimals="0" :dp="0" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="poolLegacy!.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="flex-1 h-10 shrink-0" :disabled="!!loading || !liquidityLegacyBalance" :loading="loading === ACTION_WITHDRAW_LEGACY" aria-label="Withdraw" @click="() => onWithdrawLiquidity(true)">Withdraw</ZButton>
              <ZButton class="flex-1 h-10 shrink-0" :disabled="!!loading || !liquidityLegacyBalance" :loading="loading === ACTION_MIGRATE_LEGACY" aria-label="Migrate" @click="() => onMigrateLiquidity(true)">Migrate</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>

      <div v-for="token in config.tokens" :key="token.address" class="relative flex flex-col bg-card rounded-lg w-full sm:w-[272px] max-w-[311px]">
        <div class="relative flex justify-center rounded-t-lg w-full h-[78px] overflow-hidden">
          <img class="w-[311px] max-w-max h-[78px] pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Item background">
          <ZChainIcon class="top-1 right-1 absolute size-4" :chain-id="token.chainId" />
        </div>
        <div class="top-[65px] left-4 sm:left-6 absolute">
          <ZTokenIcon class="!size-6" :token="token" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pt-8 pb-6">
          <div class="flex-y-center gap-2">
            <n-text class="text-sm">{{ token.symbol }}</n-text>
            <n-text depth="1">Legacy</n-text>
          </div>
          <div class="flex justify-between mt-4 sm:mt-6 text-xs">
            <n-text depth="1">Balance</n-text>
            <ZBalance :value="allBalances[token.address] || 0n" :decimals="token.decimals" :dp="4" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="token?.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="flex-1 h-10" :disabled="!!loading || !allBalances[token.address]" :loading="loading === token.address" aria-label="Withdraw" @click="() => onWithdrawToken(token)">Withdraw</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  </ZContainer>
</template>

<script setup lang="ts">
import type { Callback, Token } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import { useNotification } from 'naive-ui'
import { getErrorMessage, wait } from '@/utils'
import { appChainId } from '@/hooks/useAppState'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { getMigration, migrateLiquidity, removeLiquidity, unexchange } from '@/hooks/useMigration'
import { configReady } from '@/hooks/useConfig'
import { createTokenStatesForMap } from '@/hooks/useTokenState'
import { approveLiquidity, checkLiquidityAllowance, getSupportedChains } from '@/hooks/useManager'
import { allowance, approve } from '@/hooks/useToken'
import { waitForTransactionReceipt } from '@/hooks/useClient'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZPoolName from '@/components/ZPoolName.vue'
import ZButton from '@/components/ZButton.vue'
import ZBalance from '@/components/ZBalance.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import poolBg from '@/assets/images/pool-bg.svg'
import { createLiquidityState } from '@/hooks/useLiquidityState'
import ZChainIcon from '@/components/ZChainIcon.vue'

const notification = useNotification()

const config = computed(() => getMigration(appChainId.value))
const poolOld = computed(() => config.value?.poolOld)
const poolLegacy = computed(() => config.value?.poolLegacy)

const liquidityLegacyToken = computed(() => poolLegacy.value?.liquidity)

const allTokens = computed(() => config.value ? [liquidityLegacyToken.value, ...config.value.tokens].filter(it => !!it) : [])

const allBalances = ref<Record<string, bigint>>({})

const liquidityOldBalance = ref(0n)
const liquidityLegacyBalance = computed(() => config.value ? allBalances.value[liquidityLegacyToken.value!.address] || 0n : 0n)

const supportedChains = ref<{ chainId: number }[]>([])

const debounceUpdateLiquidity = ref<DebouncedFunc<Callback>>()
const debounceUpdateBalances = ref<DebouncedFunc<Callback>>()

const loading = ref('')

const ACTION_WITHDRAW_LEGACY = 'withdraw-legacy'
const ACTION_MIGRATE_LEGACY = 'migrate-legacy'
const ACTION_WITHDRAW_OLD = 'withdraw-old'
const ACTION_MIGRATE_OLD = 'migrate-old'

const showError = (err: unknown, title = 'Error') => {
  notification.error({
    title,
    content: getErrorMessage(err, 'Error'),
    duration: 3000,
  })
}

const showSuccess = (message: string, title = 'Success') => {
  notification.success({
    title,
    content: message,
    duration: 3000,
  })
}

const onApproval = async (token: Token, amount: bigint, spender: string) => {
  try {
    const tx = await approve(token, spender, amount)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    return true
  } catch (err) {
    showError(err, 'Approve fail')
    return false
  }
}

const onApprovalLiquidity = async () => {
  try {
    const tx = await approveLiquidity(poolOld.value!, config.value.address, liquidityOldBalance.value)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    return true
  } catch (err) {
    showError(err, 'Approve fail')
    return false
  }
}

const checkAllowance = async (token: Token, amount: bigint, spender: string) => {
  const allowed = await allowance(token, account.value, spender)
  return allowed >= amount
}

const ensureApproved = async (token: Token, amount: bigint, spender: string) => {
  let approved = await checkAllowance(token, amount, spender)
  if (!approved) {
    const success = await onApproval(token, amount, spender)
    if (success) {
      showSuccess('Approve success')
      updateNativeBalance()
      approved = await checkAllowance(token, amount, spender)
    }
  }

  return approved
}

const ensureApprovedLiquidity = async () => {
  let approved = await checkLiquidityAllowance(poolOld.value!, account.value, liquidityOldBalance.value, config.value.address)
  if (!approved) {
    const success = await onApprovalLiquidity()
    if (success) {
      showSuccess('Approve success')
      updateNativeBalance()
      approved = await checkLiquidityAllowance(poolOld.value!, account.value, liquidityOldBalance.value, config.value.address)
    }
  }

  return approved
}

const ensureLiquidity = async (legacy = true) => {
  loading.value = legacy ? ACTION_WITHDRAW_LEGACY : ACTION_WITHDRAW_OLD
  let approved
  if (legacy) {
    approved = await ensureApproved(liquidityLegacyToken.value!, liquidityLegacyBalance.value, config.value.address)
    if (!approved) {
      loading.value = ''
      return false
    }
  } else {
    approved = await ensureApprovedLiquidity()
    if (!approved) {
      loading.value = ''
      return false
    }
  }

  return true
}

const onWithdrawLiquidity = async (legacy: boolean) => {
  const ensured = await ensureLiquidity(legacy)
  if (!ensured) {
    return
  }

  const pool = legacy ? poolLegacy.value : poolOld.value
  try {
    await wait(1000)
    const tx = await removeLiquidity(pool!.chainId, pool!.key)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Withdraw success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    showError(err, 'Withdraw fail')
  }

  loading.value = ''
}

const onMigrateLiquidity = async (legacy: boolean) => {
  const ensured = await ensureLiquidity(legacy)
  if (!ensured) {
    return
  }

  const pool = legacy ? poolLegacy.value : poolOld.value
  try {
    await wait(1000)
    const tx = await migrateLiquidity(pool!.chainId, pool!.key)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Migrate success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    showError(err, 'Migrate fail')
  }

  loading.value = ''
}

const onWithdrawToken = async (token: Token & { origin: string }) => {
  loading.value = token.address
  const approved = await ensureApproved(token, allBalances.value[token.address], config.value.address)
  if (!approved) {
    loading.value = ''
    return
  }

  try {
    await wait(1000)
    const tx = await unexchange({ address: token.origin, chainId: token.chainId })
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Withdraw success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    showError(err, 'Withdraw fail')
  }

  loading.value = ''
}

onMounted(async () => {
  debounceUpdateLiquidity.value = createLiquidityState(account, poolOld, liquidityOldBalance)
  debounceUpdateBalances.value = createTokenStatesForMap(account, allTokens, allBalances)

  await configReady()

  supportedChains.value = getSupportedChains()
  debounceUpdateLiquidity.value!()
  debounceUpdateBalances.value!()
})
</script>
