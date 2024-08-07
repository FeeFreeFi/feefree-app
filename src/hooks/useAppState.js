import { ref, readonly, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getChainIdByKey, getChainKey, getDefaultChain } from "./useChains"

const appChainIdRef = ref(getDefaultChain().id)

export const appChainId = readonly(appChainIdRef)

/**
 * @param {number} chainId
 */
export const setAppChainId = chainId => {
  appChainIdRef.value = chainId
}

export const syncRouteChain = () => {
  const route = useRoute()
  const router = useRouter()

  const updateRouteChain = chainId => {
    const chain = getChainKey(chainId)
    router.push({ replace: true, name: route.name, params: route.params, query: { ...route.query, chain } })
  }

  const onRouteChange = () => {
    const { chain } = route.query
    if (!chain) {
      updateRouteChain(appChainId.value)
      return
    }

    const chainId = getChainIdByKey(chain)
    if (chainId && appChainId.value !== chainId) {
      setAppChainId(chainId)
    }
  }

  const onAppChainIdChange = () => {
    const { chain } = route.query
    const chainId = getChainIdByKey(chain)
    if (appChainId.value !== chainId) {
      updateRouteChain(appChainId.value)
    }
  }

  onMounted(() => {
    const stopWatch = watch(appChainId, onAppChainIdChange)
    onBeforeUnmount(stopWatch)

    onRouteChange()
    onAppChainIdChange()
  })
}

export const getRouteUpdater = () => {
  const router = useRouter()
  const route = useRoute()

  const update = (query, replace = false) => {
    router.push({ replace, name: route.name, params: route.params, query: { ...route.query, ...query } })
  }

  return { update }
}
