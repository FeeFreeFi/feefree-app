<template>
  <ZModalWrapper :show="show" :on-close="close" :on-leave="reset" modal-class="w-[400px]">
    <ConnectorView :on-close="close" />
  </ZModalWrapper>
</template>

<script setup lang="ts">
import { acceptInvite } from '@/api'
import { show, close } from '@/hooks/useWalletConnector'
import { reset } from '@/hooks/useConnecting'
import { account } from '@/hooks/useWallet'
import { referral, profile, canAcceptInvite, fetchProfile } from '@/hooks/useUser'
import ZModalWrapper from '@/components/ZModalWrapper.vue'
import ConnectorView from './ConnectorView.vue'

const handleInvite = async () => {
  if (!account.value || !referral.value || !profile.value || !canAcceptInvite(referral.value)) {
    return
  }

  const res = await acceptInvite({ referral: referral.value })
  if (res.code !== 0) {
    console.warn(res.message)
    return
  }

  await fetchProfile()
}

onMounted(() => {
  const stopWatch = watch([account, profile], () => {
    handleInvite()
  })

  onBeforeUnmount(stopWatch)
})
</script>
