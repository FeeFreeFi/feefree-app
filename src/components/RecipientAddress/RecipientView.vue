<template>
  <ZModalView title="Recipient Address" :on-close="onClose">
    <div class="px-4 pb-4 flex flex-col">
      <div class="flex overflow-hidden">
        <div class="flex-1 bg-card px-2 sm:px-4 overflow-hidden relative">
          <n-input v-model:value="input" class="w-full text-[11px] sm:text-xs text-basic" :bordered="false" placeholder="Destination Address" size="large" :on-focus="onInputFocus" :on-blur="onInputBlur" />
        </div>
        <div>
          <ZButton v-if="!input || focus" class="!rounded-l-none h-full w-12 sm:w-[68px] px-0 text-xs sm:text-sm" @click="onPaste">Paste</ZButton>
          <ZButton v-else class="!rounded-l-none h-full w-12 sm:w-[68px] px-0 text-xs sm:text-sm" @click="onClear">Clear</ZButton>
        </div>
      </div>
      <div v-if="!focus && input && (isSame || !isValid)" class="mt-4 p-3 flex-y-center gap-3 bg-error/10 rounded-lg">
        <div class="self-start flex-y-center h-5">
          <i-ff-error class="size-4" />
        </div>
        <div class="flex-1 flex">
          <n-text class="text-sm text-error">{{ isSame ? 'Please enter an address different than the connected wallet address' : 'Invalid Address' }}</n-text>
        </div>
      </div>
      <div v-if="!recipient" class="mt-4">
        <n-checkbox v-model:checked="checked" :disabled="!isValid || isSame">Please ensure that the address is correct and not an exchange wallet. Any tokens sent to the wrong address will be impossible to retrieve.</n-checkbox>
      </div>
      <div class="mt-6">
        <ZButton v-if="recipient" class="w-full h-10 sm:h-12" aria-label="Remove Recipient Addresss" @click="onClear">Remove Recipient Addresss</ZButton>
        <ZButton v-else class="w-full h-10 sm:h-12" :disabled="!input || isSame || !checked || !isValid" aria-label="Confirm Recipient Addresss" @click="onOk">Confirm Recipient Addresss</ZButton>
      </div>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isAddress } from 'viem'
import { pasteText } from '@/utils'
import { account } from '@/hooks/useWallet'
import ZModalView from '@/components/ZModalView.vue'
import ZButton from '../ZButton.vue'

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const recipient = defineModel({ type: String, required: true })

const focus = ref(false)
const checked = ref(false)
const input = ref(recipient.value)
const isValid = ref(isAddress(input.value))

const isSame = computed(() => !!input.value && input.value === account.value)

const onClear = () => {
  input.value = ''
  recipient.value = ''
  checked.value = false
  isValid.value = false
}

const onInputFocus = () => {
  focus.value = true
}

const onInputBlur = () => {
  focus.value = false
  isValid.value = input.value ? isAddress(input.value) : false
}

const onPaste = async () => {
  const text = await pasteText()
  if (text) {
    input.value = text
    onInputBlur()
  }
}

const onOk = () => {
  recipient.value = input.value
  props.onClose()
}
</script>
