import { computed } from "vue"
import { copyText } from "@/utils/clipboard"
import { getAccountReferral } from "@/utils/accountHash"
import { account } from "./useWallet"
import { profile } from "./useUser"

/**
 * @param {import('naive-ui').MessageApi} message
 */
export const createShare = message => {
  const referral = computed(() => profile.value ? profile.value.referral : getAccountReferral(account.value))
  const shareUrl = computed(() => {
    const url = new URL(window.location.href)
    url.searchParams.append("referral", referral.value)

    return url.href
  })

  const onShare = async () => {
    if (!account.value) {
      return
    }

    const success = await copyText(shareUrl.value)
    success && message.success("Referral copied, share and earn!")
  }

  return { referral, shareUrl, onShare }
}
