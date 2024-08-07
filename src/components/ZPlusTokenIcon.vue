<template>
  <div class="relative">
    <ZTokenIcon :class="tokenClass" :token="token" />
    <IconPlus v-if="isPlus" class="absolute top-[-4px] right-[-4px]" :class="plusClass" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isExchangeToken } from '@/hooks/useSwap'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import IconPlus from '@/components/IconPlus.vue'

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  tokenClass: {
    type: String,
    default: '',
  },
  plusClass: {
    type: String,
    default: '',
  },
})

const isPlus = computed(() => props.token && isExchangeToken(props.token))
</script>
