<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center">
      <NftImage class="size-16 aspect-square rounded" :src="data.nft.image" :label="data.nft.label" />
    </div>
    <div class="mt-3 flex-center">
      <n-text>{{ data.nft.label }}</n-text>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import NftImage from "./NftImage.vue"

/** @type {import('vue').ModelRef<import('@/types').MintAction>}*/
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
