<template>
  <div class="flex-center gap-2">
    <n-text depth="1">Spender</n-text>
    <div class="inline-flex gap-1">
      <a class="flex-y-center gap-2 text-primary/80 no-underline" :href="url" target="_blank" :aria-label="address">
        <n-text class="text-inherit shrink-0">{{ shortString(address) }}</n-text>
      </a>
      <ZCopyable class="flex justify-end cursor-pointer" :text="address">
        <template #copied>
          <div class="flex-y-center gap-1" aria-label="Copy address">
            <span aria-label="Copied">
              <i-ff-success class="size-4" />
            </span>
          </div>
        </template>
        <div class="flex-y-center gap-1" aria-label="Copy address">
          <span aria-label="Copy">
            <i-ff-copy class="size-4 text-primary/80" />
          </span>
        </div>
      </ZCopyable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shortString } from '@/utils'
import { getContractUrl } from '@/hooks/useChains'
import ZCopyable from '@/components/ZCopyable.vue'

interface Props {
  chainId: number
  address: string
}

const props = defineProps<Props>()

const url = computed(() => getContractUrl(props.chainId, props.address))
</script>
