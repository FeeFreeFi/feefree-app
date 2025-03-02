<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <ZPoolName :pool="pool" />
      <ZViewUrl :url="url" :label="false" />
    </div>
    <router-link class="flex-y-center gap-1 no-underline cursor-pointer" :to="{ name: PAGE_MIGRATE }">
      <i-ff-migration class="size-4" />
      <n-text type="primary">Migrate</n-text>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { PoolMeta } from '@/types'
import { PAGE_MIGRATE } from '@/config'
import { getContractUrl } from '@/hooks/useChains'
import { getPoolAddress } from '@/hooks/useManager'
import ZPoolName from '@/components/ZPoolName.vue'
import ZViewUrl from '@/components/ZViewUrl.vue'

interface Props {
  pool: PoolMeta
}

const props = defineProps<Props>()

const url = computed(() => props.pool ? getContractUrl(props.pool.chainId, getPoolAddress(props.pool.chainId)) : '')
</script>
