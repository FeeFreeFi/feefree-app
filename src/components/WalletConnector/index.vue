<template>
  <ZModalWrapper :show="show" :on-close="close" :on-leave="reset" modal-class="w-[480px]">
    <ConnectorView :on-close="close" />
  </ZModalWrapper>
</template>

<script setup>
import { show, close } from "@/hooks/useWalletConnector"
import { reset } from "@/hooks/useConnecting"
import ZModalWrapper from "@/components/ZModalWrapper.vue"
import ConnectorView from "./ConnectorView.vue"
</script>
