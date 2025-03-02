<template>
  <ActionModal v-model="modelValue">
    <template #icon="{ state }">
      <i-ff-smile v-if="state === kState.success" class="size-full" />
      <i-ff-sad v-else-if="state === kState.fail" class="size-full" />
      <i-ff-launch v-else class="size-full" />
    </template>
    <div class="flex flex-col flex-1 my-4">
      <TokenItem :name="data!.name" :symbol="data!.symbol" :decimals="data!.decimals" :total-supply="data!.totalSupply" :price="price" :asset="data!.asset" />
      <i-ff-vs class="self-center my-3 size-5" />
      <TokenItem :name="`${data!.name}-`" :symbol="`${data!.symbol}-`" :decimals="data!.decimals" :total-supply="data!.totalSupply" :price="price" :asset="data!.asset" />
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { LaunchAction } from '@/types'
import { kState } from '@/config'
import { formatPrice, byDecimals } from '@/utils'
import ActionModal from '@/components/ActionModal/index.vue'
import TokenItem from './TokenItem.vue'

const modelValue = defineModel<LaunchAction>({ required: true })

const data = computed(() => modelValue.value.data)

const price = computed(() => {
  if (!data.value) {
    return ''
  }

  const { asset, amount, totalSupply, decimals } = data.value
  const amountAsset = byDecimals(amount, asset.decimals)
  const amountToken = byDecimals(totalSupply, decimals)

  return formatPrice(amountAsset.div(amountToken).toNumber(), 8)
})
</script>
