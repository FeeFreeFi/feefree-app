<template>
  <ZModalView title="Recipient Address" :on-close="onClose">
    <div class="flex flex-col gap-4">
      <div>
        <n-input v-model:value="input" :readonly="!!recipient" placeholder="Destination Address" size="large" :input-props="{class: '!text-xs sm:!text-base'}" :on-input="onInputChange">
          <template #suffix>
            <n-button v-if="!input" class="underline" type="info" text strong aria-label="paste" @click="onPaste">Paste</n-button>
            <n-button v-else-if="!recipient" text aria-label="reset" @click="onClear">
              <n-text class="text-color-3">
                <i-ic-round-cancel class="size-6" />
              </n-text>
            </n-button>
          </template>
        </n-input>
      </div>
      <n-alert v-if="isSame || !isValid" type="error" :bordered="false">
        {{ isSame ? 'Please enter an address different than the connected wallet address' : 'Invalid Address' }}
      </n-alert>
      <div v-if="!recipient" class="bg-block p-4">
        <n-checkbox v-model:checked="checked" :disabled="!input || isSame || !isValid">Please ensure that the address is correct and not an exchange wallet. Any tokens sent to the wrong address will be impossible to retrieve.</n-checkbox>
      </div>
      <n-button v-if="recipient" class="h-12 !text-white" type="info" block strong aria-label="Remove Recipient Addresss" @click="onRemove">Remove Recipient Addresss</n-button>
      <n-button v-else class="h-12 !text-white" type="info" :disabled="!input || isSame || !checked || !isValid" block strong aria-label="Confirm Recipient Addresss" @click="onOk">Confirm Recipient Addresss</n-button>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, computed } from "vue"
import { isAddress } from 'viem'
import { pasteText } from "@/utils/clipboard"
import { account } from "@/hooks/useWallet"
import ZModalView from '@/components/ZModalView.vue'

const recipient = defineModel({ type: String, default: "" })

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const checked = ref(false)
const input = ref(recipient.value)
const isValid = ref(true)

const isSame = computed(() => !!input.value && input.value === account.value)

const onPaste = async () => {
  const text = await pasteText()
  if (text) {
    input.value = text
    onInputChange()
  }
}

const onClear = () => {
  input.value = ""
  checked.value = false
  isValid.value = true
}

const onInputChange = () => {
  isValid.value = input.value ? isAddress(input.value) : true
}

const onRemove = () => {
  input.value = ""
  recipient.value = ""
}

const onOk = () => {
  recipient.value = input.value
  props.onClose()
}
</script>
