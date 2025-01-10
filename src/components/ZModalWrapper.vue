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

<script setup>
import { ref } from 'vue'
import { screen } from '@/hooks/useScreen'

const props = defineProps({
  modalClass: {
    type: String,
    default: '',
  },
  drawerClass: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onLeave: {
    type: Function,
    default: () => {},
  },
})

const maskClosable = ref(true)

const onAfterEnter = () => {
  maskClosable.value = true
}

const onUpdateShow = value => {
  if (!value) {
    maskClosable.value = false
    props.onClose()
  }
}
</script>
