<template>
  <ZContainer class="flex flex-col">
    <div class="flex mb-4 justify-between">
      <!-- All Pools -->
      <div class="flex-center gap-3">
        <i-my-pools class="size-6" />
        <n-text class="text-base font-semibold">All Pools</n-text>
      </div>
      <!-- TVL -->
      <div class="flex-center gap-3">
        <ZChainIcon :chain-id="selectedChainId" class="size-5" />
        <n-text class="text-base font-semibold">TVL ${{ toBalance(totalTVL) }}</n-text>
      </div>
    </div>
    <div class="grid gap-y-4 sm:gap-y-8 grid-cols-1 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-2 md:gap-x-32 lg:grid-cols-3 lg:gap-x-14 xl:grid-cols-4 xl:gap-x-8 2xl:grid-cols-5 2xl:gap-x-4 justify-items-center">
      <div class="relative w-full max-w-[311px] sm:w-[272px] flex flex-col bg-card rounded-lg" v-for="pool in pools" :key="pool.id">
        <div class="relative w-full h-[78px] flex justify-center overflow-hidden rounded-t-lg">
          <img class="w-[311px] h-[78px] max-w-max" :src="poolBg" loading="lazy" alt="Pool background">
        </div>
        <ZPoolIcon class="absolute left-4 sm:left-6 top-[65px]" :currency0="pool.currency0" :currency1="pool.currency1" />
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-8">
          <div class="flex">
            <PoolName :symbol0="pool.currency0.symbol" :symbol1="pool.currency1.symbol" />
          </div>
          <div class="mt-4 sm:mt-6 flex justify-between text-xs">
            <n-text depth="1">TVL</n-text>
            <n-text>${{ toBalance(poolStates[pool.id].tvl, 0) }}</n-text>
          </div>
          <div class="mt-6 flex">
            <router-link :to="{ name: PAGE_POOL_OVERVIEW, params: { id: pool.id } }" class="w-full">
              <ZButton class="w-full">Enter</ZButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </ZContainer>
</template>

<script setup>
import { computed } from "vue"
import { PAGE_POOL_OVERVIEW } from '@/config'
import { toBalance } from "@/utils/bn"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { getPools } from "@/hooks/useSwap"
import { createPriceState } from "@/hooks/usePrices"
import { createPoolStates } from "@/hooks/usePoolState"
import ZContainer from "@/components/ZContainer.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"
import ZButton from "@/components/ZButton.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import PoolName from "@/components/PoolName.vue"
import poolBg from "@/assets/images/pool-bg.svg"

const pools = computed(() => getPools(selectedChainId.value))
const poolIds = computed(() => pools.value.map(p => p.id))

const { states: poolStates, update: updatePoolStates } = createPoolStates(poolIds)
createPriceState(updatePoolStates)

const totalTVL = computed(() => Object.values(poolStates.value).map(p => p.tvl).reduce((sum, item) => sum + item, 0n))
</script>
