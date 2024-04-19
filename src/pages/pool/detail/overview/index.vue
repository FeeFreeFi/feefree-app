<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-1">
      <i-my-pool class="size-6 text-primary" />
      <PoolName class="font-medium text-xl" :symbol0="currency0.symbol" :symbol1="currency1.symbol" />
    </div>
    <div class="flex items-center gap-3">
      <n-text class="text-color-3 text-sm">Contract</n-text>
      <div class="flex items-center gap-2">
        <n-text class="cursor-default text-sm flex-1 text-color-3">{{ shortString(poolAddress) }}</n-text>
        <ZCopyable :text="poolAddress">
          <template #copied>
            <n-button class="size-6 px-0 rounded" size="tiny" tertiary type="success" aria-label="copied">
              <i-mdi-checkbox-marked-circle class="size-4" />
            </n-button>
          </template>
          <n-button class="size-6 px-0 rounded" size="tiny" tertiary aria-label="copy">
            <n-text class="text-color-3">
              <i-mdi-content-copy class="size-4" />
            </n-text>
          </n-button>
        </ZCopyable>
      </div>
    </div>
    <!-- Token Price -->
    <TokenPrice class="self-start" :currency0="currency0" :currency1="currency1" :price0="poolState.price0" :price1="poolState.price1" />
    <!-- Assets in Pool -->
    <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
      <n-text class="text-color-3">Assets in Pool</n-text>
      <div class="flex-y-center gap-4">
        <n-text class="text-color-3 text-sm">{{ poolState.percent0 }}</n-text>
        <div class="flex-y-center gap-2">
          <ZTokenIcon :token="currency0" />
          <ZTokenBalance content-class="text-sm" :token="currency0" :balance="poolState.balance0" :dp="3" />
        </div>
      </div>
      <div class="flex-y-center gap-4">
        <n-text class="text-color-3 text-sm">{{ poolState.percent1 }}</n-text>
        <div class="flex-y-center gap-2">
          <ZTokenIcon :token="currency1" />
          <ZTokenBalance content-class="text-sm" :token="currency1" :balance="poolState.balance1" :dp="3" />
        </div>
      </div>
    </div>
    <!-- TVL -->
    <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
      <n-text class="text-color-3 text-sm">TVL</n-text>
      <n-text>${{ toBalance(poolState.tvl) }}</n-text>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import shortString from "@/utils/shortString"
import { toBalance } from "@/utils/bn"
import { getPoolAddress } from "@/hooks/useRouter"
import { getPool } from "@/hooks/useSwap"
import { createPriceState } from "@/hooks/usePrices"
import { createPoolState } from "@/hooks/usePoolState"
import ZCopyable from "@/components/ZCopyable.vue"
import PoolName from "@/components/PoolName.vue"
import TokenPrice from "./TokenPrice.vue"

const route = useRoute()
const pool = getPool(route.params.id)
const { currency0, currency1 } = pool

const poolAddress = computed(() => getPoolAddress(pool.chainId))

const { state: poolState, update: updatePoolState } = createPoolState(route.params.id)
createPriceState(updatePoolState)
</script>

