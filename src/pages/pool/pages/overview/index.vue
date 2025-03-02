<template>
  <div class="flex-1 lg:bg-card lg:rounded-2xl">
    <div v-if="pool" class="flex flex-col gap-4 lg:p-6">
      <!-- Header -->
      <PoolHeader :pool="pool" />
      <!-- Pool Price -->
      <PoolPrice :pool="pool" :price0="poolData.price0" :price1="poolData.price1" />
      <!-- TVL -->
      <ItemBox class="!bg-card lg:!bg-box" label="TVL">
        <div>
          <n-text>${{ toBalance(poolData.tvl) }}</n-text>
        </div>
      </ItemBox>
      <!-- Assets in Pool -->
      <AssetsDetail class="!bg-card lg:!bg-box" label="Assets in Pool" :currency0="pool.currency0" :currency1="pool.currency1" :data="poolData" :holder="getPoolAddress(pool.chainId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PoolData, PoolMeta } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_NOT_FOUND } from '@/config'
import { toBalance, decodePoolId } from '@/utils'
import { configReady } from '@/hooks/useConfig'
import { fetchPoolMeta, getPoolData } from '@/hooks/usePool'
import { getPoolAddress, isSupportChain } from '@/hooks/useManager'
import { onPriceChanged } from '@/hooks/usePrices'
import { createPoolState } from '@/hooks/usePoolState'
import PoolHeader from './PoolHeader.vue'
import PoolPrice from './PoolPrice.vue'
import ItemBox from '../../components/ItemBox.vue'
import AssetsDetail from '../../components/AssetsDetail.vue'

const route = useRoute()
const router = useRouter()

const pool = ref<PoolMeta>()
const poolData = ref<PoolData>(getPoolData())

onMounted(async () => {
  const debounceUpdatePool = createPoolState(pool, poolData)
  onPriceChanged(debounceUpdatePool)

  await configReady()

  try {
    const { valid, chainId, poolId } = decodePoolId(route.params.id as string)
    if (!valid || !isSupportChain(chainId!)) {
      router.replace({ name: PAGE_NOT_FOUND })
      return
    }

    pool.value = await fetchPoolMeta(chainId!, poolId!)
  } catch (err) {
    console.log(err)
    router.replace({ name: PAGE_NOT_FOUND })
  }
})
</script>
