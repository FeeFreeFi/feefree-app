<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <!-- Header -->
    <div v-if="screen.lg" class="hidden lg:flex justify-between items-center">
      <div class="flex">
        <n-text class="font-medium text-base">My Position</n-text>
      </div>
    </div>
    <div v-if="hasPosition" class="flex flex-col gap-4">
      <!-- Total Value -->
      <div class="flex flex-col lg:flex-row gap-4">
        <ItemBox class="flex-1" label="Liquidity">
          <div class="flex-y-center gap-2">
            <ZPoolIcon :currency0="currency0" :currency1="currency1" />
            <ZTokenBalance :token="currencyLiquidity" :balance="positionData.liquidity" :dp="9" :show-symbol="false" />
          </div>
        </ItemBox>
        <ItemBox class="flex-1" label="Total Value">
          <div>
            <n-text>${{ toBalance(positionData.tvl) }}</n-text>
          </div>
        </ItemBox>
      </div>
      <!-- Assets in Position -->
      <AssetsDetail label="Assets in Position" :currency0="currency0" :currency1="currency1" :data="positionData" />
    </div>
    <NoPosition v-else />
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { toBalance } from "@/utils/bn"
import { screen } from "@/hooks/useScreen"
import { getPool, getPositionData } from "@/hooks/useSwap"
import { createPriceState } from "@/hooks/usePrices"
import { account } from "@/hooks/useWallet"
import { createBalanceStates } from "@/hooks/useBalances"
import { createPoolState } from "@/hooks/usePoolState"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import ItemBox from "../../components/ItemBox.vue"
import AssetsDetail from "../../components/AssetsDetail.vue"
import NoPosition from "./NoPosition.vue"

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
