<template>
  <div>
    <div v-if="screen.sm">
      <n-popover :show="show" trigger="click" :show-arrow="false" placement="bottom-end" class="!p-4 !rounded-lg" content-class="w-[260px]" :on-update:show="onUpdateShow">
        <template #trigger>
          <ProfileButton />
        </template>
        <ProfileView :on-close="close" />
      </n-popover>
    </div>
    <div v-else>
      <ProfileButton @click="open" />
      <n-drawer class="rounded-t-xl !h-auto" :show="show" :mask-closable="maskClosable" placement="bottom" :auto-focus="false" :on-after-enter="onAfterEnter" :on-update:show="onUpdateShow">
        <ZModalView title="Profile" :on-close="close">
          <ProfileView :on-close="close" />
        </ZModalView>
      </n-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { screen } from "@/hooks/useScreen"
import ZModalView from "@/components/ZModalView.vue"
import ProfileView from "./ProfileView.vue"
import ProfileButton from "./ProfileButton.vue"

const show = ref(false)
const maskClosable = ref(true)

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

const onAfterEnter = () => {
  maskClosable.value = true
}

const onUpdateShow = value => {
  if (!value) {
    maskClosable.value = false
  }
  show.value = value
}
</script>
