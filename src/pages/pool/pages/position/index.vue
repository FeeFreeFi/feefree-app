<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <!-- Header -->
    <div v-if="screen.lg" class="hidden lg:flex justify-between items-center">
      <div class="flex">
        <n-text class="font-medium text-base">My Position</n-text>
      </div>
    </div>
    <div v-if="!hasPosition" class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Total Liquidity -->
        <ItemBox class="flex-1" label="Total Liquidity">
          <div class="flex-y-center gap-2">
            <ZPoolIcon :pool="pool" />
            <ZBalance :value="totalLiquidity" />
          </div>
        </ItemBox>
        <!-- Total Value -->
        <ItemBox class="flex-1" label="Total Value">
          <div>
            <n-text>${{ toBalance(positionData.tvl) }}</n-text>
          </div>
        </ItemBox>
      </div>
      <!-- Assets in Position -->
      <AssetsDetail label="Assets in Position" :currency0="pool.currency0" :currency1="pool.currency1" :data="positionData" :holder="account" />
      <div v-if="lockDatas.length > 0" class="flex flex-col gap-4">
        <LockedLiquidity v-for="item, index in lockDatas" :key="index" :pool="pool" :data="item" :unlocking="unlocking" @unlock="onUnlock" />
      </div>
    </div>
    <NoPosition v-else />
    <UnlockModal v-model="unlockAction" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toBalance } from "@/utils/bn"
import { screen } from "@/hooks/useScreen"
import { onPriceChanged } from "@/hooks/usePrices"
import { account, updateNativeBalance } from "@/hooks/useWallet"
import { fetchPoolMeta, getPoolData, getPositionData } from "@/hooks/usePool"
import { configReady } from "@/hooks/useConfig"
import { createLiquidityState } from "@/hooks/useLiquidityState"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import ZBalance from "@/components/ZBalance.vue"
import ItemBox from "../../components/ItemBox.vue"
import AssetsDetail from "../../components/AssetsDetail.vue"
import NoPosition from "./NoPosition.vue"
import { createPoolState } from "@/hooks/usePoolState"
import { getLockDatas, unlock } from "@/hooks/useTimelock"
import { decodePoolId } from "@/utils/poolId"
import LockedLiquidity from "./LockedLiquidity.vue"
import UnlockModal from "./UnlockModal.vue"
import { doSend } from "@/hooks/useInteraction"
import { isSupportChain } from "@/hooks/useManager"
import { PAGE_NOT_FOUND } from "@/config"

const route = useRoute()
const router = useRouter()

/** @type {import('vue').Ref<import('@/types').PoolMeta>} */
const pool = ref(null)
/** @type {import('vue').Ref<import('@/types').PoolData>} */
const poolData = ref(getPoolData())

const freeLiquidity = ref(0n)
/** @type {import('vue').Ref<import('@/types').LockData[]>} */
const lockDatas = ref([])
const totalLiquidity = computed(() => lockDatas.value.reduce((sum, item) => sum + item.amount, freeLiquidity.value))

const hasPosition = computed(() => totalLiquidity.value > 0n)
const positionData = computed(() => hasPosition.value ? getPositionData(pool.value.id, poolData.value.sqrtPriceX96, totalLiquidity.value) : null)

const unlocking = ref(false)
const unlockAction = ref({ show: false })

/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateLiquidity = ref(null)

const fetchLockDatas = async (force = false) => {
  if (!pool.value || !account.value) {
    lockDatas.value = []
    return
  }

  lockDatas.value = await getLockDatas(pool.value, account.value, force)
}

/**
 * @param {import('@/types').LockData} lockData
 */
const onUnlock = async lockData => {
  unlockAction.value.data = { pool, lock: lockData }

  const success = await doSend(unlockAction, unlocking, "Unlock", () => unlock(lockData.lockId, account.value))

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

  watch([pool, account], fetchLockDatas)

  await configReady()

  try {
    const { valid, chainId, poolId } = decodePoolId(route.params.id)
    if (!valid || !isSupportChain(chainId)) {
      router.replace({ name: PAGE_NOT_FOUND })
      return
    }

    pool.value = await fetchPoolMeta(chainId, poolId)
  } catch {
    router.replace({ name: PAGE_NOT_FOUND })
  }
})
</script>
