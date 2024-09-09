<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <!-- Header -->
    <div class="h-12 flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <!-- Pool Name -->
        <div class="flex">
          <PoolName :symbol0="currency0.symbol" :symbol1="currency1.symbol" />
        </div>
        <!-- Contract Address -->
        <div class="flex items-center gap-2">
          <n-text depth="2">Contract</n-text>
          <div class="flex-center gap-2">
            <n-text depth="2">{{ shortString(poolAddress) }}</n-text>
            <ZCopyable :text="poolAddress">
              <template #copied>
                <div aria-label="copied">
                  <i-ff-success class="size-5" />
                </div>
              </template>
              <div class="cursor-pointer" aria-label="copy">
                <i-ff-copy class="size-4 text-primary/80" />
              </div>
            </ZCopyable>
          </div>
        </div>
      </div>
      <!-- Check -->
      <div>
        <a class="no-underline" :href="poolUrl" target="_blank">
          <ZGhostButton class="!h-7 lg:!h-8" aria-label="Check">Check</ZGhostButton>
        </a>
      </div>
    </div>
    <!-- Token Price -->
    <TokenPrice class="self-start" :currency0="currency0" :currency1="currency1" :price0="poolState.price0" :price1="poolState.price1" />
    <!-- TVL -->
    <ItemBox class="!bg-card lg:!bg-box" label="TVL">
      <div>
        <n-text>${{ toBalance(poolState.tvl) }}</n-text>
      </div>
    </ItemBox>
    <!-- Assets in Pool -->
    <AssetsDetail class="!bg-card lg:!bg-box" label="Assets in Pool" :currency0="currency0" :currency1="currency1" :data="poolState" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import shortString from "@/utils/shortString"
import { toBalance } from "@/utils/bn"
import { getPoolAddress } from "@/hooks/useRouter"
import { getPool } from "@/hooks/useSwap"
import { createPriceState } from "@/hooks/usePrices"
import { createPoolState } from "@/hooks/usePoolState"
import { getContractUrl } from "@/hooks/useChains"
import ZCopyable from "@/components/ZCopyable.vue"
import PoolName from "@/components/PoolName.vue"
import ZGhostButton from "@/components/ZGhostButton.vue"
import TokenPrice from "./TokenPrice.vue"
import ItemBox from "../../components/ItemBox.vue"
import AssetsDetail from "../../components/AssetsDetail.vue"

const route = useRoute()
const pool = getPool(route.params.id)
const { currency0, currency1 } = pool

const poolAddress = getPoolAddress(pool.chainId)
const poolUrl = getContractUrl(pool.chainId, poolAddress)

const { state: poolState, update: updatePoolState } = createPoolState(route.params.id)
createPriceState(updatePoolState)
</script>

