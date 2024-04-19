<template>
  <div class="relative">
    <ZTokenIcon :token="token" />
    <IconPlus v-if="isPlus" class="absolute top-[-4px] right-[-4px]" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isExchangeToken } from '@/hooks/useExchange'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import IconPlus from '@/components/IconPlus.vue'

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
})

const isPlus = computed(() => props.token && isExchangeToken(props.token))
</script>
