<template>
  <div class="flex flex-col py-6 sm:py-10 text-sm sm:text-base">
    <div class="mx-auto relative w-full">
      <div class="mb-4">
        <router-link :to="{ name: PAGE_POOL_HOME }" class="inline-flex items-center justify-center no-underline">
          <n-text><i-mdi-chevron-left class="size-5" /></n-text>
          <n-text>Pools</n-text>
        </router-link>
      </div>
      <n-tabs v-model:value="tab" :placement="screen.sm ? 'left' : 'top'" animated>
        <!-- Overview -->
        <n-tab-pane :name="TAB_OVERVIEW">
          <template #tab>
            <n-text>Overview</n-text>
          </template>
          <TabOverview :pool="pool" :pool-state="poolState" />
        </n-tab-pane>
        <!-- My Position -->
        <n-tab-pane :name="TAB_MY_POSITION">
          <template #tab>
            <n-text>My Position</n-text>
          </template>
          <TabMyPosition :pool="pool" :position-state="positionState" :has-position="hasPosition" :on-add-liquidity="onNavAddLiquidity" />
        </n-tab-pane>
        <!-- Add Liquidity -->
        <n-tab-pane :name="TAB_ADD">
          <template #tab>
            <n-text>Add Liquidity</n-text>
          </template>
          <TabAddLiquidity :pool="pool" :pool-state="poolState" :balance0="balance0" :balance1="balance1" />
        </n-tab-pane>
        <!-- Remove Liquidity -->
        <n-tab-pane :name="TAB_REMOVE">
          <template #tab>
            <n-text>Remove Liquidity</n-text>
          </template>
          <TabRemoveLiquidity />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import debounce from "lodash-es/debounce"
import { PAGE_POOL_HOME } from "@/config"
import { account } from "@/hooks/useWallet"
import { getPool, updatePoolState, getPoolState, getPositionData } from "@/hooks/useSwap"
import { updateBalances, resetBalances, getBalances } from "@/hooks/useBalances"
import { startUpdate as startUpdatePrices, stopUpdate as stopUpdatePrices, priceChanged } from "@/hooks/usePrices"
import { createInterval } from "@/hooks/useTimer"
import { screen } from "@/hooks/useScreen"
import TabOverview from "./TabOverview.vue"
import TabMyPosition from "./TabMyPosition.vue"
import TabAddLiquidity from "./TabAddLiquidity.vue"
import TabRemoveLiquidity from "./TabRemoveLiquidity.vue"

const route = useRoute()
const pool = computed(() => getPool(route.params.id))

const TAB_OVERVIEW = "overview"
const TAB_MY_POSITION = "my-position"
const TAB_ADD = "add"
const TAB_REMOVE = "remove"

const tab = ref(TAB_OVERVIEW)

const poolState = ref(getPoolState(pool.value?.id))
const balance0 = ref(0n)
const balance1 = ref(0n)
const balanceLp = ref(0n)
const hasPosition = computed(() => balanceLp.value > 0n)
const positionState = computed(() => hasPosition.value ? getPositionData(pool.value.id, poolState.value.sqrtPriceX96, balanceLp.value) : null)

const updatePool = async () => {
  if (!pool.value) {
    poolState.value = getPoolState("")
    return
  }

  const id = pool.value.id
  poolState.value = getPoolState(id)
  await updatePoolState(id)
  poolState.value = getPoolState(id)
}
const debounceUpdatePool = debounce(updatePool, 100, { leading: false, trailing: true })
const { start:startUpdatePool, stop:stopUpdatePool } = createInterval(debounceUpdatePool, 60 * 1000)

const setTokenBalances = (owner, tokens) => {
  const balances = getBalances(owner, tokens)
  balance0.value = balances[0]
  balance1.value = balances[1]
  balanceLp.value = balances[2]
}

const updateTokenBalances = async () => {
  if (!account.value || !pool.value) {
    balance0.value = 0n
    balance1.value = 0n
    balanceLp.value = 0n
    return
  }

  const { currency0, currency1, currencyLiquidity } = pool.value
  const tokens = [currency0, currency1, currencyLiquidity]

  const owner = account.value
  setTokenBalances(owner, tokens)
  await updateBalances(owner, tokens)
  setTokenBalances(owner, tokens)
}
const debounceUpdateTokenBalances = debounce(updateTokenBalances, 100, { leading: false, trailing: true })

const reset = () => {
  balance0.value = 0n
  balance1.value = 0n
  balanceLp.value = 0n
}

const onNavAddLiquidity = () => {
  tab.value = TAB_ADD
}

onMounted(() => {
  const stopWatch = watch(account, () => {
    reset()

    if (account.value) {
      debounceUpdateTokenBalances()
    } else {
      resetBalances()
    }
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  startUpdatePrices()
  startUpdatePool()
  debounceUpdateTokenBalances()

  onBeforeUnmount(() => {
    stopUpdatePrices()
    stopUpdatePool()
    debounceUpdateTokenBalances.cancel()
  })
})

onMounted(() => {
  const stopWatch = watch(priceChanged, () => {
    updatePool()
    updateTokenBalances()
  })

  onBeforeUnmount(stopWatch)
})
</script>
