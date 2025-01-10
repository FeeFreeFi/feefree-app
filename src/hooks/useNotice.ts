import type { Notice } from '@/types'
import { readonly, ref } from 'vue'
import { CACHE_NOTICE } from '@/config'
import { getStorage, setStorage } from '@/utils'
import { getNotice } from '@/api'
import { createInterval } from './useTimer'

const noticeRef = ref<Notice>()
export const notice = readonly(noticeRef)

const fetchNotice = async () => {
  const id = getStorage(CACHE_NOTICE)
  const res = await getNotice()
  if (!res || res.code !== 0) {
    return
  }

  const data = res.data
  if (data.id !== id) {
    noticeRef.value = data
  }
}

const { start: startFetchNotice, stop: stopFetchNotice } = createInterval(fetchNotice, 1800000)

export const markAsRead = () => {
  setStorage(CACHE_NOTICE, noticeRef.value?.id || '')
  noticeRef.value = undefined
}

export {
  startFetchNotice,
  stopFetchNotice,
}
