<template>
  <ZModalView class="h-[480px]" :on-close="onClose" content-class="overflow-hidden !p-0">
    <template #title>
      <div class="flex-1 flex-y-center">
        <n-button v-if="connectingWallet" secondary type="tertiary" size="small" circle aria-label="back" @click="reset">
          <i-mdi-chevron-left />
        </n-button>
        <span v-else class="size-7"></span>
        <n-text class="flex-1 text-base font-semibold text-center">Connect Wallet</n-text>
      </div>
    </template>
    <div class="h-full relative">
      <div class="size-full absolute top-0 left-0"  v-if="providers.length > 0">
        <n-tabs class="h-full relative [&>.n-tabs-nav]:hidden" :value="tab" pane-wrapper-class="h-full" pane-class="h-full relative !p-0" animated>
          <n-tab-pane :name="TAB_LIST">
            <n-scrollbar class="p-6">
              <div class="flex flex-col gap-2">
                <n-button class="h-14 rounded-2xl pl-2 pr-4 justify-start relative" v-for="item, index in providers" :key="index" size="large" secondary strong :aria-label="`connect to ${item.info.name}`" @click="() => onConnect(item)">
                  <img class="size-10 rounded-xl mr-3" :src="item.info.icon" :alt="item.info.name" loading="lazy" />
                  {{ item.info.name }}
                </n-button>
              </div>
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane :name="TAB_CONNECTING" display-directive="show:lazy">
            <div class="h-full p-4 flex-center flex-col gap-6">
              <div class="h-[120px] flex flex-col justify-center relative">
                <img class="size-20 rounded-xl" :src="connectingWallet.info.icon" :alt="connectingWallet.info.name" loading="lazy" />
                <i-my-dash v-if="!rejected" class="size-[100px] absolute translate-center text-info" />
              </div>
              <div class="flex flex-col gap-8 items-center">
                <n-text v-if="rejected" strong type="error">Connection declined</n-text>
                <n-text v-else strong>Continue in {{ connectingWallet.info.name }}</n-text>
                <n-text class="text-center text-sm px-4 text-color-3">Connection can be declined if a previous request is still active</n-text>
              </div>
              <n-button class="rounded-full" size="large" type="info" ghost strong aria-label="try again" @click="() => onConnect(connectingWallet)">
                <i-mdi-refresh class="size-5 mr-1" />
                <span>Try again</span>
              </n-button>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-empty class="size-full justify-center" v-else description="NO ETHEREUM WALLETS FOUND">
        <template #icon>
          <i-ion-wallet-sharp />
        </template>
      </n-empty>
    </div>
  </ZModalView>
</template>

<script setup>
import { computed } from "vue"
import { useNotification } from "naive-ui"
import ZModalView from '@/components/ZModalView.vue'
import { getProviders } from "@/hooks/useProviders"
import { connect } from "@/hooks/useWallet"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { connecting, reject, rejected, connectingWallet, reset } from "@/hooks/useConnecting"
import wait from "@/utils/wait"

const TAB_LIST = "list"
const TAB_CONNECTING = "connecting"

const notification = useNotification()

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const providers = getProviders()

const tab = computed(() => connectingWallet.value ? TAB_CONNECTING : TAB_LIST)

const onConnect = async wallet => {
  try {
    connecting(wallet)
    await wait(300)
    const success = await connect(wallet.provider, wallet.info, selectedChainId.value)
    success && props.onClose()
  } catch (err) {
    reject()

    notification.error({
      title: `Connect ${wallet.info.name} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}
</script>
