<template>
  <ZModalView class="h-[480px]" title="Select Token" :on-close="onClose">
    <div class="h-full flex flex-col relative">
      <div class="px-4">
        <ZSearch v-model="search" placeholder="Search by name or paste address" />
      </div>
      <div class="flex-1 relative">
        <div v-if="displayTokens.length > 0" class="size-full absolute top-0 left-0">
          <n-scrollbar class="p-4">
            <div class="flex flex-col gap-2">
              <TokenItem v-for="token, index in displayTokens" :key="index" :token="token" :balance="balances[token.address] || 0n" :show-balance="isShowBalance(token)" :active="isCurrentToken(token)" @click="() => onTokenClick(token)" />
            </div>
          </n-scrollbar>
        </div>
        <NoToken v-else />
      </div>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { getBalances, updateBalances } from "@/hooks/useBalances"
import { account } from "@/hooks/useWallet"
import { isSame } from "@/hooks/useCurrency"
import ZModalView from '@/components/ZModalView.vue'
import ZSearch from '@/components/ZSearch.vue'
import TokenItem from "./TokenItem.vue"
import NoToken from "./NoToken.vue"

const props = defineProps({
  current: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  tokens: {
    /**
     * @type {import('vue').PropType<import('@/types').Token[]>}
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
  return token => isSame(token, props.current)
})

const isShowBalance = computed(() => {
  return token => account.value && token.chainId === props.current.chainId
})

const onTokenClick = token => {
  props.onSelect(token)
  props.onClose()
}

/**
 *
 * @param {string} owner
 * @param {import('@/types').Token[]} tokens
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
