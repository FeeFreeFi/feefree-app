<template>
  <div class="flex flex-col py-6 sm:py-10 text-sm sm:text-base">
    <div class="mx-auto relative w-full">
      <div class="flex justify-between">
        <div class="flex-center px-3 py-1 rounded-full border-all !border-grey-5 text-sm gap-1">
          <i-my-nft class="size-6" />
          <n-text>FeeFree NFTs</n-text>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        <div class="flex flex-col items-center gap-2 shadow rounded-xl relative w-[300px]" v-for="item, index in nfts" :key="index">
          <div>
            <NftImage class="aspect-square rounded-t-xl" :src="item.image" :label="item.label" />
          </div>
          <!-- NFT name -->
          <div class="flex justify-center">
            <n-text>{{ item.label }}</n-text>
          </div>
          <!-- Price -->
          <div class="flex justify-center gap-2">
            <n-text class="text-color-3">Price:</n-text>
            <div class="flex" v-if="item.free">
              <span class="font-medium text-color-3 ml-1">Free</span>
            </div>
            <div class="flex" v-else>
              <ZTokenBalance :token="feeToken" :balance="item.price" :dp="9" />
              <span class="font-medium text-color-3 ml-1">(${{ getFeeValue(item.price) }})</span>
            </div>
          </div>
          <div class="w-full">
            <n-button class="!text-white rounded w-full" :disabled="switching || minting" :loading="operatingIndex === index" type="primary" strong :aria-label="item.free ? 'Free Mint' : 'Mint'" @click="() => onMint(index, item)">{{ item.free ? "Free Mint" : "Mint" }}</n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { getNftList, mint } from "@/hooks/useNft"
import { account, getWalletClient, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { waitTx } from "@/hooks/useWaitTx"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { getNativeCurrency } from "@/hooks/useChains"
import NftImage from "@/components/NftImage.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import { createPriceState, getPrice } from "@/hooks/usePrices"
import { fromValue } from "@/utils/bn"
import { doSwitchNetwork } from "@/hooks/useInteraction"

const notification = useNotification()
createPriceState()

const nfts = computed(() => getNftList(selectedChainId.value))
const feeToken = computed(() => getNativeCurrency(selectedChainId.value))

/**
 * @param {bigint} value
 */
const getFeeValue = value => {
  return fromValue(getPrice(feeToken.value.symbol)).times(value).div(1e18).dp(4).toNumber()
}

const switching = ref(false)
/**
 * @param {number} chainId
 */
const onSwitchNetwork = chainId => doSwitchNetwork(notification, switching, chainId)

const minting = ref(false)
const operatingIndex = ref(-1)

const reset = () => {
  minting.value = false
  switching.value = false
  operatingIndex.value = -1
}

const onMint = async (index, { address, label, chainId, price }) => {
  if (!account.value) {
    openWalletConnector()
    return
  }

  if (chainId !== selectedChainId.value) {
    onSwitchNetwork(chainId)
    return
  }

  operatingIndex.value = index
  minting.value = true
  try {
    const publicClient = getPublicClient(chainId)
    const walletClient = getWalletClient()
    const tx = await mint(
      { publicClient, walletClient },
      address,
      account.value,
      price,
    )
    await waitTx(notification, tx, 'Success', `Mint ${label}`)
    minting.value = false
    operatingIndex.value = -1
    updateNativeBalance()
  } catch (err) {
    minting.value = false
    operatingIndex.value = -1
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
  })

  onBeforeUnmount(stopWatch)
})
</script>
