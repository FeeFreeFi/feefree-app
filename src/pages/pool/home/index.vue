<template>
  <div class="flex flex-col py-6 text-sm sm:text-base lg:mx-24">
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
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="pool in pools" :key="pool.id" class="p-4 flex flex-col gap-4 shadow rounded-xl relative">
          <ZPoolIcon :currency0="pool.currency0" :currency1="pool.currency1" />
          <PoolName :symbol0="pool.currency0.symbol" :symbol1="pool.currency1.symbol" />
          <div class="flex justify-between items-center">
            <n-text class="text-color-3 text-sm">TVL</n-text>
            <n-text>${{ toBalance(poolStates[pool.id].tvl, 0) }}</n-text>
          </div>
          <router-link :to="{ name: PAGE_POOL_OVERVIEW, params: { id: pool.id } }" class="w-full">
            <n-button class="rounded-lg w-full" type="info" ghost>Enter</n-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { getPools } from "@/hooks/useSwap"
import { PAGE_POOL_OVERVIEW } from '@/config'
import ZChainIcon from "@/components/ZChainIcon.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import PoolName from "@/components/PoolName.vue"
import { createPriceState } from "@/hooks/usePrices"
import { toBalance } from "@/utils/bn"
import { createPoolStates } from "@/hooks/usePoolState"

const pools = computed(() => getPools(selectedChainId.value))
const poolIds = computed(() => pools.value.map(p => p.id))

const { states: poolStates, update: updatePoolStates } = createPoolStates(poolIds)
createPriceState(updatePoolStates)

const totalTVL = computed(() => Object.values(poolStates.value).map(p => p.tvl).reduce((sum, item) => sum + item, 0n))
</script>
