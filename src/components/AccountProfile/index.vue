<template>
  <div>
    <ProfileButton @click="open" />
    <ZModalWrapper :show="show" :on-close="close" :on-leave="reset" modal-class="w-[400px]">
      <ProfileView :on-close="close" />
    </ZModalWrapper>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue"
import ZModalWrapper from "@/components/ZModalWrapper.vue"
import ProfileView from "./ProfileView.vue"
import ProfileButton from "./ProfileButton.vue"

const show = ref(false)

const open = () => {
  nextTick(() => {
    show.value = true
  })
}

const close = () => {
  show.value = false
}
</script>
