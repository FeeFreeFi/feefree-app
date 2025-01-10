import type { MessageApi } from 'naive-ui'
import { computed } from 'vue'
import { copyText, getAccountReferral } from '@/utils'
import { account } from './useWallet'
import { profile } from './useUser'

export const createShare = (message: MessageApi) => {
  const referral = computed(() => profile.value ? profile.value.referral : getAccountReferral(account.value))
  const shareUrl = computed(() => {
    const url = new URL(window.location.href)
    url.searchParams.append('referral', referral.value)

    return url.href
  })

  const onShare = async () => {
    if (!account.value) {
      return
    }

    const success = await copyText(shareUrl.value)
    if (success) {
      message.success('Referral copied, share and earn!')
    }
  }

  return { referral, shareUrl, onShare }
}
