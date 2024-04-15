<template>
  <img class="size-5 rounded-full" :src="`/static/tokens/${iconName}.svg`" loading="lazy" :alt="`${iconName} icon`" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  token: {
    /**
     * @type {{chainId:number, symbol:string, address:string}}
     */
    type: Object,
    required: true,
  },
})

const iconName = computed(() => props.token ? props.token.symbol.replace(/\+$/, '') : 'default')
</script>
