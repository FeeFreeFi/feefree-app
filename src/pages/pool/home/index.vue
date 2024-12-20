<template>
  <ZContainer class="flex flex-col">
    <div class="mb-4 flex flex-col sm:flex-row justify-start sm:justify-between gap-4 sm:gap-0">
      <!-- Pools -->
      <div class="flex items-center gap-3">
        <i-ff-pools class="size-5 sm:size-6" />
        <div class="flex-y-center gap-4">
          <TabButton label="Hot Pools" :active="isActiveTab(TAB_HOT)" @click="() => onSwitchPoolTab(TAB_HOT)" />
          <TabButton v-if="account && myPools.length > 0" label="My Pools" :active="isActiveTab(TAB_MY)" @click="() => onSwitchPoolTab(TAB_MY)" />
          <!-- <router-link class="flex-y-center gap-2 no-underline cursor-pointer" :to="{ name: PAGE_POOL_CREATE }">
            <i-ff-add class="size-4" />
            <n-text type="primary">Pool</n-text>
          </router-link> -->
        </div>
      </div>
      <!-- TVL -->
      <div class="flex items-center gap-2 sm:gap-3">
        <ZChainIcon :chain-id="appChainId" class="size-5" />
        <n-text class="text-sm font-medium">TVL ${{ toBalance(totalTVL) }}</n-text>
      </div>
    </div>
    <div class="grid gap-y-4 sm:gap-y-8 grid-cols-1 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-2 md:gap-x-32 lg:grid-cols-3 lg:gap-x-14 xl:grid-cols-4 xl:gap-x-8 2xl:grid-cols-5 2xl:gap-x-4 justify-items-center">
      <div class="relative w-full max-w-[311px] sm:w-[272px] flex flex-col bg-card rounded-lg" v-for="pool in pools" :key="pool.id">
        <div class="relative w-full h-[78px] flex justify-center overflow-hidden rounded-t-lg">
          <img class="w-[311px] h-[78px] max-w-max pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="absolute size-4 top-1 right-1" :chain-id="pool.chainId" />
        </div>
        <div class="absolute left-4 sm:left-6 top-[65px]">
          <ZPoolIcon :pool="pool" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-8">
          <div class="flex">
            <ZPoolName :pool="pool" />
          </div>
          <div class="mt-4 sm:mt-6 flex justify-between text-xs">
            <n-text depth="1">TVL</n-text>
            <n-text>${{ toBalance(poolDatas[pool.id]?.tvl || 0n, 0) }}</n-text>
          </div>
          <div class="mt-6 flex">
            <router-link :to="{ name: PAGE_POOL_OVERVIEW, params: { id: encodePoolId(pool.chainId, pool.id) } }" class="w-full">
              <ZButton class="w-full">Enter</ZButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </ZContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { PAGE_POOL_OVERVIEW } from '@/config'
import { toBalance } from "@/utils/bn"
import { appChainId, syncRouteChain } from "@/hooks/useAppState"
import { loadMyPools as _loadMyPools, getPools } from "@/hooks/usePool"
import { onPriceChanged } from "@/hooks/usePrices"
import { configReady } from "@/hooks/useConfig"
import { createPoolStates } from "@/hooks/usePoolState"
import { account } from "@/hooks/useWallet"
import { encodePoolId } from "@/utils/poolId"
import ZContainer from "@/components/ZContainer.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"
import ZButton from "@/components/ZButton.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import ZPoolName from "@/components/ZPoolName.vue"
import TabButton from "./TabButton.vue"
import poolBg from "@/assets/images/pool-bg.svg"

const TAB_HOT = "#hot"
const TAB_MY = "#my"
const tab = ref(TAB_HOT)

const isActiveTab = computed(() => active => tab.value === active)
/** @type {import('vue').Ref<import('@/types').PoolMeta[]>} */
const hotPools = ref([])
/** @type {import('vue').Ref<import('@/types').PoolMeta[]>} */
const myPools = ref([])
const pools = computed(() => tab.value === TAB_HOT ? hotPools.value : myPools.value)

/** @type {import('vue').Ref<{[id:string]: import('@/types').PoolData}>} */
const poolDatas = ref({})

const totalTVL = computed(() => Object.values(poolDatas.value).map(p => p.tvl).reduce((sum, item) => sum + item, 0n))

const loadHotPools = () => {
  hotPools.value = getPools(appChainId.value, true)
}

const loadMyPools = async () => {
  myPools.value = await _loadMyPools(appChainId.value, account.value)
}

const onSwitchPoolTab = active => {
  tab.value = active
}

onMounted(async () => {
  syncRouteChain()

  watch(appChainId, loadHotPools)

  const { debounceUpdate } = createPoolStates(pools, poolDatas)
  onPriceChanged(debounceUpdate)

  await configReady()

  watch([appChainId, account], loadMyPools)

  loadHotPools()
  await loadMyPools()
})
</script>
