<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-1">
      <i-my-my-position class="size-6 text-primary" />
      <n-text class="font-medium text-xl">My Position</n-text>
    </div>
    <div v-if="hasPosition" class="flex-x-center gap-4">
      <!-- Total Value -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 shadow p-4 flex flex-col gap-4 rounded-2xl">
          <n-text class="text-color-3 text-sm">Liquidity</n-text>
          <div class="flex-y-center">
            <ZPoolIcon :currency0="currency0" :currency1="currency1" />
            <ZTokenBalance content-class="text-sm" :token="currencyLiquidity" :balance="positionData.liquidity" :dp="3" :show-symbol="false" />
          </div>
        </div>
        <div class="flex-1 shadow p-4 flex flex-col gap-4 rounded-2xl">
          <n-text class="text-color-3 text-sm">Total Value</n-text>
          <n-text>${{ toBalance(positionData.tvl) }}</n-text>
        </div>
      </div>
      <!-- Assets in Position -->
      <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
        <n-text class="text-color-3">Assets in Position</n-text>
        <div class="flex-y-center gap-4">
          <n-text class="text-color-3 text-sm">{{ positionData.percent0 }}</n-text>
          <div class="flex-y-center gap-2">
            <ZTokenIcon :token="currency0" />
            <ZTokenBalance content-class="text-sm" :token="currency0" :balance="positionData.balance0" :dp="3" />
          </div>
        </div>
        <div class="flex-y-center gap-4">
          <n-text class="text-color-3 text-sm">{{ positionData.percent1 }}</n-text>
          <div class="flex-y-center gap-2">
            <ZTokenIcon :token="currency1" />
            <ZTokenBalance content-class="text-sm" :token="currency1" :balance="positionData.balance1" :dp="3" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="pt-10 flex flex-col items-center gap-3">
      <i-my-position class="size-10 text-primary" />
      <n-text>You have no position in this pool</n-text>
      <n-text class="text-color-3 text-sm">Deposit to open a position!</n-text>
      <router-link :to="{ name: PAGE_POOL_DEPOSIT }">
        <n-button type="info" aria-label="Deposit">Deposit</n-button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { toBalance } from "@/utils/bn"
import { PAGE_POOL_DEPOSIT } from "@/config"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import { getPool, getPositionData } from "@/hooks/useSwap"
import { createPriceState } from "@/hooks/usePrices"
import { account } from "@/hooks/useWallet"
import { createBalanceStates } from "@/hooks/useBalances"
import { createPoolState } from "@/hooks/usePoolState"

const route = useRoute()
const pool = getPool(route.params.id)
const { currency0, currency1, currencyLiquidity } = pool

const { state: poolState, update: updatePoolState } = createPoolState(route.params.id)
createPriceState(updatePoolState)

const { states: balanceStates } = createBalanceStates(account, [currencyLiquidity])
const balanceLiquidity = computed(() => balanceStates.value[0])

const hasPosition = computed(() => balanceLiquidity.value > 0n)
const positionData = computed(() => hasPosition.value ? getPositionData(pool.id, poolState.value.sqrtPriceX96, balanceLiquidity.value) : null)
</script>
