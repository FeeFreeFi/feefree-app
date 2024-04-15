<template>
  <div class="p-1 flex flex-col gap-4">
    <div class="flex items-center gap-1">
      <i-my-pool class="size-6 text-primary" />
      <PoolName class="font-medium text-xl" :symbol0="pool.currency0.symbol" :symbol1="pool.currency1.symbol" />
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
    <TokenPrice class="self-start" :currency0="pool.currency0" :currency1="pool.currency1" :price0="poolState.price0" :price1="poolState.price1" />
    <!-- Assets in Pool -->
    <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
      <n-text class="text-color-3">Assets in Pool</n-text>
      <div class="flex-y-center gap-4">
        <n-text class="text-color-3 text-sm">{{ poolState.percent0 }}</n-text>
        <div class="flex-y-center gap-2">
          <ZTokenIcon :token="pool.currency0" />
          <ZTokenBalance content-class="text-sm" :token="pool.currency0" :balance="poolState.balance0" :dp="3" />
        </div>
      </div>
      <div class="flex-y-center gap-4">
        <n-text class="text-color-3 text-sm">{{ poolState.percent1 }}</n-text>
        <div class="flex-y-center gap-2">
          <ZTokenIcon :token="pool.currency1" />
          <ZTokenBalance content-class="text-sm" :token="pool.currency1" :balance="poolState.balance1" :dp="3" />
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
import shortString from "@/utils/shortString"
import { toBalance } from "@/utils/bn"
import { getPoolAddress } from "@/hooks/useRouter"
import ZCopyable from "@/components/ZCopyable.vue"
import PoolName from "@/components/PoolName.vue"
import TokenPrice from "./TokenPrice.vue"

const props = defineProps({
  pool: {
    type: Object,
    required: true,
  },
  poolState: {
    type: Object,
    required: true,
  },
})

const poolAddress = computed(() => getPoolAddress(props.pool.chainId))
</script>
