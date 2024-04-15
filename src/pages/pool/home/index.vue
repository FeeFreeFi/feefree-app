<template>
  <div class="flex flex-col py-6 sm:py-10 text-sm sm:text-base">
    <div class="mx-auto relative w-full">
      <div class="flex justify-between">
        <!-- All Pools -->
        <div class="flex-center px-3 py-1 rounded-full border-all !border-grey-5 text-sm">
          <i-my-pool class="size-5 text-info mr-2" />
          <n-text>All Pools</n-text>
        </div>
        <!-- TVL -->
        <div class="flex-center px-3 py-1 rounded-full border-all !border-grey-5 text-sm">
          <ZChainIcon :chain-id="selectedChainId" class="size-5" />
          <n-text class="ml-1">TVL</n-text>
          <n-text class="ml-2">${{ toBalance(totalTVL) }}</n-text>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:md:grid-cols-4 gap-4">
        <div v-for="pool in pools" :key="pool.id" class="p-4 flex flex-col gap-4 shadow rounded-xl relative">
          <div class="flex justify-center relative">
            <span class="p-1 bg-white rounded-full shadow translate-x-[4px] z-[1]"><ZTokenIcon class="size-6" :token="pool.currency0"/></span>
            <span class="p-1 bg-white rounded-full shadow translate-x-[-4px]"><ZTokenIcon class="size-6" :token="pool.currency1" /></span>
          </div>
          <PoolName :symbol0="pool.currency0.symbol" :symbol1="pool.currency1.symbol" />
          <div class="flex justify-between items-center">
            <n-text class="text-color-3 text-sm">TVL</n-text>
            <n-text>${{ toBalance(poolStates[pool.id]?.tvl || 0, 0) }}</n-text>
          </div>
          <router-link :to="{ name: PAGE_POOL_DETAIL, params: { id: pool.id } }" class="w-full">
            <n-button class="rounded-lg w-full" type="info" ghost>Enter</n-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue"
import debounce from "lodash-es/debounce"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { updatePoolStates, getPoolStates, getPools } from "@/hooks/useSwap"
import { PAGE_POOL_DETAIL } from '@/config'
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"
import PoolName from "@/components/PoolName.vue"
import { startUpdate as startUpdatePrices, stopUpdate as stopUpdatePrices, priceChanged } from "@/hooks/usePrices"
import { createInterval } from "@/hooks/useTimer"
import { toBalance } from "@/utils/bn"

const pools = computed(() => getPools(selectedChainId.value))
const poolIds = computed(() => pools.value.map(p => p.id))

const poolStates = ref(getPoolStates(poolIds.value))
const totalTVL = computed(() => Object.values(poolStates.value).map(p => p.tvl).reduce((sum, item) => sum + item, 0n))

const updatePools = async () => {
  const ids = poolIds.value
  if (ids.length === 0) {
    poolStates.value = {}
    return
  }

  poolStates.value = getPoolStates(ids)
  await updatePoolStates(ids)
  poolStates.value = getPoolStates(ids)
}
const debounceUpdatePools = debounce(updatePools, 100, { leading: false, trailing: true })
const { start:startUpdatePools, stop:stopUpdatePools } = createInterval(debounceUpdatePools, 60 * 1000)

onMounted(() => {
  startUpdatePrices()
  startUpdatePools()

  onBeforeUnmount(() => {
    stopUpdatePrices()
    stopUpdatePools()
  })
})

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    debounceUpdatePools()
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  const stopWatch = watch(priceChanged, () => {
    updatePools()
  })

  onBeforeUnmount(stopWatch)
})
</script>
