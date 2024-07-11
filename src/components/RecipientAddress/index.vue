<template>
  <div>
    <div class="flex-y-center justify-between">
      <n-text depth="1">Recipient Address</n-text>
      <div v-if="!modelValue" class="flex-y-center gap-2" :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" aria-label="add recipient" @click="onOpen">
        <i-my-add class="size-4" />
        <n-text type="primary">Add Address</n-text>
      </div>
      <div v-else class="flex-y-center gap-2" :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" aria-label="edit recipient" @click="onOpen">
        <n-text>{{ shortString(modelValue) }}</n-text>
        <n-text type="primary">Edit</n-text>
      </div>
    </div>
    <ZModalWrapper :show="show" :on-close="onClose" modal-class="w-[490px]">
      <RecipientView v-model="modelValue" :on-close="onClose" />
    </ZModalWrapper>
  </div>
</template>

<script setup>
import { ref } from "vue"
import shortString from "@/utils/shortString"
import ZModalWrapper from "@/components/ZModalWrapper.vue"
import RecipientView from "./RecipientView.vue"

const modelValue = defineModel({ type: String, required: true })

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const show = ref(false)

const onClose = () => {
  show.value = false
}

const onOpen = () => {
  if (props.disabled) {
    return
  }

  show.value = true
}
</script>
