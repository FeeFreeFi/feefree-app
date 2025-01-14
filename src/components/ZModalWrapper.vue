<template>
  <div>
    <n-modal v-if="screen.sm" class="bg-dialog rounded-lg" :class="modalClass" :show="show" :mask-closable="maskClosable" :auto-focus="false" :on-after-enter="onAfterEnter" :on-update:show="onUpdateShow" :on-after-leave="onLeave">
      <slot />
    </n-modal>
    <n-drawer v-else class="bg-dialog !rounded-t-2xl !h-auto" :class="drawerClass" placement="bottom" :show="show" :mask-closable="maskClosable" :auto-focus="false" :on-after-enter="onAfterEnter" :on-update:show="onUpdateShow" :on-after-leave="onLeave">
      <slot />
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { screen } from '@/hooks/useScreen'

interface Props {
  modalClass?: string
  drawerClass?: string
  show: boolean
  onClose: () => void
  onLeave?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  modalClass: '',
  drawerClass: '',
  onLeave: () => {},
})

const maskClosable = ref(true)

const onAfterEnter = () => {
  maskClosable.value = true
}

const onUpdateShow = (value: boolean) => {
  if (!value) {
    maskClosable.value = false
    props.onClose()
  }
}
</script>
