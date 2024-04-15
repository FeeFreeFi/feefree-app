<template>
  <div class="flex flex-col py-6 sm:py-10">
    <div class="mx-auto relative w-full sm:w-[520px] h-[428px] sm:h-[488px]">
      <ZSectionView>
        <!-- header -->
        <div class="h-10 flex-y-center justify-between">
          <n-text class="text-xl sm:text-2xl font-medium">Week NFTs</n-text>
        </div>
        <div class="mt-4 flex flex-col gap-4">
          <div class="text-sm flex justify-between items-center bg-block p-3" v-for="item, index in nfts" :key="index">
            <!-- <i-my-nft class="size-6" /> -->
            <WeekNftIcon :chain-id="item.chainId" />
            <n-text class="text-color-3">{{ item.label }}</n-text>
            <div class="w-20 text-color-3 text-center">
              <n-tooltip trigger="hover" v-if="isMinted(index)">
                <template #trigger>
                  <n-a class="no-underline hover:underline" :href="`${getNftExplorerUrl(item.chainId, item.address, states[index])}`" target="_blank">{{ states[index].toString(10) }}</n-a>
                </template>
                <span class="text-xs sm:text-sm">{{ `${item.label}-${states[index].toString(10)}` }}</span>
              </n-tooltip>
            </div>
            <div class="w-[114px] flex justify-end">
              <span class="flex-1"></span>
              <n-button class="!text-white rounded" :disabled="switching || isMinted(index) || loading" :loading="switching || loading && mintingIndex === index" type="primary" strong :aria-label="`${isMinted(index) ? 'Minted' : 'Free Mint'}`" @click="() => onMint(index, item)">{{ !!states[index] ? "Minted" : "Free Mint" }}</n-button>
            </div>
          </div>
        </div>
      </ZSectionView>
    </div>
  </div>
</template>

<script setup>
import debounce from "lodash-es/debounce"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { getNftList, getStates, updateStates, mint, getNftExplorerUrl } from "@/hooks/useNft"
import { account, getWalletClient, switchChain, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { waitTx } from "@/hooks/useWaitTx"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import ZSectionView from '@/components/ZSectionView.vue'
import WeekNftIcon from '@/components/WeekNftIcon.vue'
import { getChainName } from "@/hooks/useChains"

const notification = useNotification()

const nfts = computed(() => getNftList(selectedChainId.value))
const states = ref(getStates(account.value, nfts.value))
const mintingIndex = ref(-1)
const isMinted = computed(() => index => !!states.value[index])

const loading = ref(false)
const switching = ref(false)

const update = async () => {
  if (!account.value) {
    return
  }

  states.value = getStates(account.value, nfts.value)
  await updateStates(account.value, nfts.value)
  states.value = getStates(account.value, nfts.value)
}
const debounceUpdate = debounce(update, 100, { leading: false, trailing: true })

const reset = () => {
  states.value = ref(nfts.value.map(() => false))
  mintingIndex.value = -1
  loading.value = false
  switching.value = false
}

const onSwitchNetwork = async id => {
  try {
    switching.value = true
    await switchChain(id)
    switching.value = false
  } catch (err) {
    switching.value = false
    notification.error({
      title: `Switch to ${getChainName(id)} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

const onMint = async (index, { address, label, chainId }) => {
  if (!account.value) {
    openWalletConnector()
    return
  }

  if (chainId !== selectedChainId.value) {
    onSwitchNetwork(chainId)
    return
  }

  loading.value = true
  mintingIndex.value = index
  try {
    const publicClient = getPublicClient(chainId)
    const walletClient = getWalletClient()
    const tx = await mint(
      { publicClient, walletClient },
      address,
    )
    await waitTx(notification, tx, 'Success', `Mint ${label}`)
    loading.value = false
    debounceUpdate()
    updateNativeBalance()
  } catch (err) {
    loading.value = false
    notification.error({
      title: `Mint ${label} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

onMounted(() => {
  const stopWatch = watch([account, selectedChainId], () => {
    reset()
    debounceUpdate()
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  debounceUpdate()

  onBeforeUnmount(() => {
    debounceUpdate.cancel()
  })
})
</script>
