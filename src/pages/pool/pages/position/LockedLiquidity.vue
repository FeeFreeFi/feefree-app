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

<script setup lang="ts">
import type { CountdownTimeInfo } from 'naive-ui'
import type { LockData, PoolMeta } from '@/types'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZButton from '@/components/ZButton.vue'
import ZBalance from '@/components/ZBalance.vue'
import dayjs from 'dayjs'

interface Props {
  pool: PoolMeta
  data: LockData
  unlocking: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'unlock', data: LockData): void
}>()

const duration = computed(() => {
  const now = dayjs().unix()
  const diff = Number(props.data.unlockTime) - now
  return diff > 0 ? diff * 1000 : 0
})

const disabled = ref(duration.value > 0)

const renderCountdown = (e: CountdownTimeInfo) => {
  const { hours, minutes, seconds } = e
  const days = (hours - hours % 24) / 24

  return `${days > 0 ? `${days}d ` : ''}${String(hours % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const onFinish = () => {
  disabled.value = false
}

const onUnlock = () => {
  emit('unlock', props.data)
}
</script>
