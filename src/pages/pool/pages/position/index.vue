<template>
  <div class="flex flex-col flex-1 gap-4 lg:bg-card lg:p-6 lg:rounded-2xl">
    <!-- Header -->
    <div v-if="screen.lg" class="hidden lg:flex justify-between items-center">
      <div class="flex">
        <n-text class="font-medium text-base">My Position</n-text>
      </div>
    </div>
    <div v-if="hasPosition" class="flex flex-col gap-4">
      <div class="flex md:flex-row flex-col gap-4">
        <!-- Total Liquidity -->
        <ItemBox class="flex-1" label="Total Liquidity">
          <div class="flex-y-center gap-2">
            <ZPoolIcon :pool="pool!" />
            <ZBalance :value="totalLiquidity" />
          </div>
        </ItemBox>
        <!-- Total Value -->
        <ItemBox class="flex-1" label="Total Value">
          <div>
            <n-text>${{ toBalance(positionData!.tvl) }}</n-text>
          </div>
        </ItemBox>
      </div>
      <!-- Assets in Position -->
      <AssetsDetail label="Assets in Position" :currency0="pool!.currency0" :currency1="pool!.currency1" :data="positionData!" :holder="account" />
      <div v-if="lockDatas.length > 0" class="flex flex-col gap-4">
        <LockedLiquidity v-for="item, index in lockDatas" :key="index" :pool="pool!" :data="item" :unlocking="unlocking" @unlock="onUnlock" />
      </div>
    </div>
    <NoPosition v-else />
    <UnlockModal v-model="unlockAction" />
  </div>
</template>

<script setup lang="ts">
import type { DebouncedFunc } from 'lodash-es'
import type { Callback, LockData, PoolData, PoolMeta, UnlockAction } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_NOT_FOUND } from '@/config'
import { toBalance, decodePoolId } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { onPriceChanged } from '@/hooks/usePrices'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { fetchPoolMeta, getPoolData, getPositionData } from '@/hooks/usePool'
import { configReady } from '@/hooks/useConfig'
import { createLiquidityState } from '@/hooks/useLiquidityState'
import { createPoolState } from '@/hooks/usePoolState'
import { getLockDatas, unlock } from '@/hooks/useTimelock'
import { doSend } from '@/hooks/useInteraction'
import { isSupportChain } from '@/hooks/useManager'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZBalance from '@/components/ZBalance.vue'
import ItemBox from '../../components/ItemBox.vue'
import AssetsDetail from '../../components/AssetsDetail.vue'
import NoPosition from './NoPosition.vue'
import LockedLiquidity from './LockedLiquidity.vue'
import UnlockModal from './UnlockModal.vue'

const route = useRoute()
const router = useRouter()

const pool = ref<PoolMeta>()
const poolData = ref<PoolData>(getPoolData())

const freeLiquidity = ref(0n)
const lockDatas = ref<LockData[]>([])
const totalLiquidity = computed(() => lockDatas.value.reduce((sum, item) => sum + item.amount, freeLiquidity.value))

const hasPosition = computed(() => totalLiquidity.value > 0n)
const positionData = computed(() => hasPosition.value ? getPositionData(pool.value!.id, poolData.value.sqrtPriceX96, totalLiquidity.value) : undefined)

const unlocking = ref(false)
const unlockAction = ref<UnlockAction>({ show: false })

const debounceUpdateLiquidity = ref<DebouncedFunc<Callback>>()

const fetchLockDatas = async (force = false) => {
  if (!pool.value || !account.value) {
    lockDatas.value = []
    return
  }

  lockDatas.value = await getLockDatas(pool.value, account.value, force)
}

const onUnlock = async (lockData: LockData) => {
  unlockAction.value.data = {
    chainId: pool.value!.chainId,
    pool: pool.value!,
    lock: lockData,
  }

  const success = await doSend(unlockAction, unlocking, 'Unlock', () => unlock(lockData.lockId, account.value))

  if (success) {
    updateNativeBalance()

    debounceUpdateLiquidity.value && debounceUpdateLiquidity.value()
    fetchLockDatas(true)
  }
}

onMounted(async () => {
  const debounceUpdatePool = createPoolState(pool, poolData)
  onPriceChanged(debounceUpdatePool)

  debounceUpdateLiquidity.value = createLiquidityState(account, pool, freeLiquidity)

  watch([pool, account], () => fetchLockDatas())

  await configReady()

  try {
    const { valid, chainId, poolId } = decodePoolId(route.params.id as string)
    if (!valid || !isSupportChain(chainId!)) {
      router.replace({ name: PAGE_NOT_FOUND })
      return
    }

    pool.value = await fetchPoolMeta(chainId!, poolId!)
  } catch {
    router.replace({ name: PAGE_NOT_FOUND })
  }
})
</script>
