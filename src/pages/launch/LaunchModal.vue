<template>
  <ActionModal v-model="modelValue">
    <template #icon="{ state }">
      <i-ff-smile v-if="state == States.SUCCESS" class="size-full" />
      <i-ff-sad v-else-if="state == States.FAIL" class="size-full" />
      <i-ff-launch v-else class="size-full" />
    </template>
    <div class="my-4 flex-1 flex flex-col">
      <TokenItem :name="data.name" :symbol="data.symbol" :decimals="data.decimals" :total-supply="data.totalSupply" :price="price" :asset="data.asset" />
      <i-ff-vs class="my-3 size-5 self-center" />
      <TokenItem :name="`${data.name}-`" :symbol="`${data.symbol}-`" :decimals="data.decimals" :total-supply="data.totalSupply" :price="price" :asset="data.asset" />
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import { States } from "@/config"
import formatPrice from "@/utils/formatPrice"
import { byDecimals } from "@/utils/bn"
import ActionModal from "@/components/ActionModal/index.vue"
import TokenItem from "./TokenItem.vue"

/** @type {import('vue').ModelRef<import('@/types').LaunchAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)

const price = computed(() => {
  const { asset, amount, totalSupply, decimals } = data.value
  const amountAsset = byDecimals(amount, asset.decimals)
  const amountToken = byDecimals(totalSupply, decimals)

  return formatPrice(amountAsset.div(amountToken).toNumber(), 8)
})
</script>
