<template>
  <ZContainer class="flex flex-col ">
    <div class="flex mb-4">
      <div class="flex-center gap-3">
        <i-my-nfts class="size-6" />
        <n-text class="text-base font-semibold">FeeFree NFTs</n-text>
      </div>
    </div>
    <div class="grid gap-y-4 sm:gap-y-8 grid-cols-1 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-2 md:gap-x-32 lg:grid-cols-3 lg:gap-x-14 xl:grid-cols-4 xl:gap-x-8 2xl:grid-cols-5 2xl:gap-x-4 justify-items-center">
      <div class="relative w-full max-w-[400px] sm:w-[272px] flex flex-col bg-card rounded-lg" v-for="item, index in nfts" :key="index">
        <div class="w-full aspect-square">
          <NftImage class="aspect-square rounded-t-lg" :src="item.image" :label="item.label" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-4">
          <!-- NFT name -->
          <div class="flex">
            <n-text class="text-base font-medium">{{ item.label }}</n-text>
          </div>
          <!-- Minted -->
          <div class="mt-3 sm:mt-4 flex justify-between text-xs">
            <n-text depth="1">Minted:</n-text>
            <div class="flex">
              <n-text>{{ toBalance(nftStates[index]) }}/{{ item.capLabel }}</n-text>
            </div>
          </div>
          <!-- Price -->
          <div class="mt-2 sm:mt-3 flex justify-between text-xs">
            <n-text depth="1">Price:</n-text>
            <div class="flex" v-if="item.free">
              <n-text class="text-primary">Free</n-text>
            </div>
            <div class="flex" v-else>
              <ZTokenBalance class="ml-1" :token="feeToken" :balance="item.price" :dp="9" />
              <n-text>(${{ getFeeValue(item.price) }})</n-text>
            </div>
          </div>
          <div class="mt-4 sm:mt-6 flex">
            <ActionButton class="w-full" btn-class="!h-10" :chain-id="item.chainId" :chains="supportedChains">
              <ZButton class="h-10 w-full" :disabled="minting" :loading="operatingIndex === index" :aria-label="item.free ? 'Free Mint' : 'Mint'" @click="() => onMint(index, item)">{{ item.free ? "Free Mint" : "Mint" }}</ZButton>
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
    <MintModal v-model="mintAction" />
  </ZContainer>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { fromValue, toBalance } from "@/utils/bn"
import { createNftStates, getNftList, getSupportedChains } from "@/hooks/useNft"
import { account, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { getNativeCurrency } from "@/hooks/useChains"
import { createPriceState, getPrice } from "@/hooks/usePrices"
import { doMint } from "@/hooks/useInteraction"
import ZContainer from "@/components/ZContainer.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZButton from "@/components/ZButton.vue"
import NftImage from "@/components/NftImage.vue"
import ActionButton from "@/components/ActionButton.vue"
import MintModal from "./MintModal.vue"

createPriceState()

const supportedChains = getSupportedChains()
const nfts = computed(() => getNftList(selectedChainId.value))
const feeToken = computed(() => getNativeCurrency(selectedChainId.value))

const { states: nftStates, update: updateNftStates } = createNftStates(nfts)

/**
 * @param {bigint} value
 */
const getFeeValue = value => {
  return fromValue(getPrice(feeToken.value.symbol)).times(value).div(1e18).dp(4).toNumber()
}

const mintAction = ref({ show: false })
const minting = ref(false)
const operatingIndex = ref(-1)

const reset = () => {
  minting.value = false
  operatingIndex.value = -1
}

/**
 * @param {number} index
 * @param {import('@/types').Nft} nft
 */
const onMint = async (index, nft) => {
  operatingIndex.value = index
  const succuess = await doMint(mintAction, minting, nft, account.value)
  operatingIndex.value = -1

  if (succuess) {
    updateNativeBalance()
    updateNftStates(true)
  }
}

onMounted(() => {
  const stopWatch = watch([account, selectedChainId], () => {
    reset()
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    updateNftStates(true)
  })

  onBeforeUnmount(stopWatch)
})
</script>
