<template>
  <ZModalWrapper :show="show" :on-close="onClose" modal-class="w-[520px]">
    <RecipientView v-model="model" :on-close="onClose" />
  </ZModalWrapper>
</template>

<script setup>
import ZModalWrapper from "@/components/ZModalWrapper.vue"
import RecipientView from "./RecipientView.vue"

const show = defineModel("show", { type: Boolean, default: false })
const model = defineModel({ type: String, default: "" })

const onClose = () => {
  show.value = false
}
</script>
