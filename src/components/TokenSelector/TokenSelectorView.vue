<template>
  <ZModalView class="h-[480px]" content-class="overflow-hidden !p-0" title="Select Token" :on-close="onClose">
    <div class="h-full flex flex-col relative">
      <div class="p-4">
        <div class="bg-block h-12 flex-y-center rounded">
          <n-input class="search-input !bg-transparent" v-model:value="search" placeholder="Search by name or paste address" size="large">
            <template #prefix>
              <i-material-symbols-search class="size-5 text-color-3" />
            </template>
          </n-input>
        </div>
      </div>
      <n-divider class="!my-0" />
      <n-scrollbar class="flex-1">
        <div class="flex flex-col px-[5px] py-2" v-if="displayTokens.length > 0">
          <n-button class="h-14 !p-0 flex-col items-stretch" v-for="token, index in displayTokens" :key="index" :class="isCurrentToken(token) ? '!bg-pressed' : ''" quaternary block @click="() => onTokenClick(token)">
            <div class="flex-1 flex-y-center px-4 py-2 gap-2">
              <slot name="token" :token="token">
                <ZTokenIcon :token="token" />
              </slot>
              <div class="flex flex-col justify-between items-start">
                <n-text class="font-medium text-sm">{{ token.name }}</n-text>
                <n-text class="text-xs text-color-3">{{ token.symbol }}</n-text>
              </div>
              <div class="flex-1"></div>
              <ZTokenBalance v-if="account && token.chainId === current.chainId" content-class="text-color-3" :show-symbol="false" :token="token" :balance="balances[token.address] || 0n" />
              <n-text v-else class="text-sm text-color-3">{{ getChainName(token.chainId) }}</n-text>
            </div>
          </n-button>
        </div>
        <n-empty class="size-full justify-center absolute" v-else description="NO TOKENS FOUND">
          <template #icon>
            <i-solar-dollar-bold />
          </template>
        </n-empty>
      </n-scrollbar>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { getChainName } from "@/hooks/useChains"
import { getBalances, updateBalances } from "@/hooks/useBalances"
import { account } from "@/hooks/useWallet"
import ZModalView from '@/components/ZModalView.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

const props = defineProps({
  current: {
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
  tokens: {
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}[]>}
     */
    type: Array,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onSelect: {
    type: Function,
    required: true,
  },
})

const search = ref('')

/**
 * @type {import('vue').Ref<{[address:string]: bigint}>}
 */
const balances = ref({})

const displayTokens = computed(() => {
  const key = search.value
  const reg = new RegExp(key, "i")
  const addressReg = new RegExp(`^${key}$`, "i")
  const list = props.tokens.filter(token => !key || reg.test(token.name) || reg.test(token.symbol) || addressReg.test(token.address))
  const items = list.filter(it => it.chainId === props.current.chainId)
  const others = list.filter(it => it.chainId !== props.current.chainId)

  return [...items, ...others]
})

const isCurrentToken = computed(() => {
  return token => token.chainId === props.current.chainId && token.address === props.current.address
})

const onTokenClick = token => {
  props.onSelect(token)
  props.onClose()
}

/**
 *
 * @param {string} owner
 * @param {{chainId:number, address:string}} tokens
 */
const refreshBalances = (owner, tokens) => {
  const result = getBalances(owner, tokens)
  balances.value = Object.fromEntries(tokens.map((t, index) => [t.address, result[index]]))
}

const update = async () => {
  if (!account.value) {
    return
  }

  const owner = account.value
  const tokens = props.tokens
  refreshBalances(owner, tokens)
  await updateBalances(owner, tokens)
  refreshBalances(owner, tokens)
}

onMounted(update)
</script>

<style lang="scss">
.search-input {
  .n-input__input-el {
    @apply caret-color-base text-sm;
  }

  .n-input__placeholder {
    @apply text-color-3 text-sm;
  }

  .n-input__border {
    display: none;
  }

  .n-input__state-border {
    display: none;
  }
}
</style>
