import { readonly, ref } from "vue"
import { CACHE_NOTICE } from "@/config"
import { getStorage, setStorage } from "@/utils/storage"
import { getNotice } from "@/api"
import { createInterval } from "./useTimer"

/**
 * @type {import('vue').Ref<import('@/types').Notice>}
 */
const noticeRef = ref(null)
export const notice = readonly(noticeRef)

const fetchNotice = async () => {
  const id = getStorage(CACHE_NOTICE)
  const res = await getNotice()
  if (!res || res.code !== 0) {
    return
  }

  const notice = res.data
  if (notice.id !== id) {
    noticeRef.value = notice
  }
}

const { start: startFetchNotice, stop: stopFetchNotice } = createInterval(fetchNotice, 1800000)

export const markAsRead = () => {
  setStorage(CACHE_NOTICE, noticeRef.value?.id || "")
  noticeRef.value = null
}

export {
  startFetchNotice,
  stopFetchNotice,
}
