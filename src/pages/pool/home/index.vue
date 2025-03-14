<template>
  <ZContainer class="flex flex-col">
    <div class="flex sm:flex-row flex-col justify-start sm:justify-between gap-4 sm:gap-0 mb-4">
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
        <n-text class="font-medium text-sm">TVL ${{ toBalance(totalTVL) }}</n-text>
      </div>
    </div>
    <div class="justify-items-center gap-y-4 sm:gap-y-8 sm:gap-x-8 md:gap-x-32 lg:gap-x-14 xl:gap-x-8 2xl:gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <div v-for="pool in pools" :key="pool.id" class="relative flex flex-col bg-card rounded-lg w-full sm:w-[272px] max-w-[311px]">
        <div class="relative flex justify-center rounded-t-lg w-full h-[78px] overflow-hidden">
          <img class="w-[311px] max-w-max h-[78px] pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="top-1 right-1 absolute size-4" :chain-id="pool.chainId" />
        </div>
        <div class="top-[65px] left-4 sm:left-6 absolute">
          <ZPoolIcon :pool="pool" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pt-8 pb-6">
          <div class="flex">
            <ZPoolName :pool="pool" />
          </div>
          <div class="flex justify-between mt-4 sm:mt-6 text-xs">
            <n-text depth="1">TVL</n-text>
            <n-text>${{ toBalance(poolDatas[pool.id]?.tvl || 0n, 0) }}</n-text>
          </div>
          <div class="flex mt-6">
            <router-link :to="{ name: PAGE_POOL_OVERVIEW, params: { id: encodePoolId(pool.chainId, pool.id) } }" class="w-full">
              <ZButton class="w-full">Enter</ZButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </ZContainer>
</template>

<script setup lang="ts">
import type { PoolData, PoolMeta } from '@/types'
import { PAGE_POOL_OVERVIEW } from '@/config'
import { toBalance, encodePoolId } from '@/utils'
import { appChainId, syncRouteChain } from '@/hooks/useAppState'
import { loadMyPools as _loadMyPools, getPools } from '@/hooks/usePool'
import { onPriceChanged } from '@/hooks/usePrices'
import { configReady } from '@/hooks/useConfig'
import { createPoolStates } from '@/hooks/usePoolState'
import { account } from '@/hooks/useWallet'
import ZContainer from '@/components/ZContainer.vue'
import ZChainIcon from '@/components/ZChainIcon.vue'
import ZButton from '@/components/ZButton.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZPoolName from '@/components/ZPoolName.vue'
import TabButton from './TabButton.vue'
import poolBg from '@/assets/images/pool-bg.svg'

const TAB_HOT = '#hot'
const TAB_MY = '#my'
const tab = ref(TAB_HOT)

const isActiveTab = computed(() => (active: string) => tab.value === active)

const hotPools = ref<PoolMeta[]>([])
const myPools = ref<PoolMeta[]>([])
const pools = computed(() => tab.value === TAB_HOT ? hotPools.value : myPools.value)

const poolDatas = ref<Record<string, PoolData>>({})

const totalTVL = computed(() => Object.values(poolDatas.value).map(p => p.tvl).reduce((sum, item) => sum + item, 0n))

const loadHotPools = () => {
  hotPools.value = getPools(appChainId.value, true)
}

const loadMyPools = async () => {
  myPools.value = await _loadMyPools(appChainId.value, account.value)
}

const onSwitchPoolTab = (active: string) => {
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
