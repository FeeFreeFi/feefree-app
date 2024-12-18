<template>
  <div class="p-4 lg:p-6 flex flex-col gap-3 bg-box lg:bg-tab rounded">
    <div class="h-5 flex items-center justify-between">
      <n-text class="text-xs" depth="1">Locked Liquidity</n-text>
      <n-countdown v-if="duration > 0 && disabled" :render="renderCountdown" :duration="duration" :on-finish="onFinish" />
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1 flex-y-center gap-2">
        <ZPoolIcon :pool="pool" />
        <ZBalance :value="data.amount" />
      </div>
      <div class="flex-1 flex justify-center sm:justify-end">
        <ZButton class="h-8 w-24" :disabled="disabled" :loading="unlocking" size="small" aria-label="Unlock" @click="onUnlock">Unlock</ZButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import ZButton from "@/components/ZButton.vue"
import ZBalance from "@/components/ZBalance.vue"
import dayjs from "dayjs"

const props = defineProps({
  pool: {
    /**
     * @type {import('vue').PropType<import('@/types').PoolMeta>}
     */
     type: Object,
    required: true,
  },
  data: {
    /**
     * @type {import('vue').PropType<import('@/types').LockData>}
     */
    type: Object,
    required: true,
  },
  unlocking: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(["unlock"])

const duration = computed(() => {
  const now = dayjs().unix()
  const diff = props.data.unlockTime - now
  return diff > 0 ? diff * 1000 : 0
})

const disabled = ref(duration.value > 0)

const renderCountdown = ({ hours, minutes, seconds }) => {
  const days = (hours - hours % 24) / 24
  hours = hours % 24
  return `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const onFinish = () => {
  disabled.value = false
}

const onUnlock = () => {
  emit("unlock", props.data)
}
</script>
