import { getUserProfile } from "@/api"
import { CACHE_REFERRAL } from "@/config"
import { setStorage } from "@/utils/storage"
import { readonly, ref } from "vue"

/**
 * @type {import('vue').Ref<import('@/types').Profile>}
 */
const profileRef = ref(null)

const referralRef = ref('')

export const fetchProfile = async () => {
  const res = await getUserProfile()
  if (res.code !== 0) {
    console.log(res.message)
    return false
  }

  profileRef.value = res.data
  return true
}

export const resetProfile = () => {
  profileRef.value = null
}

/**
 * @param {string} value
 */
export const saveReferral = value => {
  referralRef.value = value
  setStorage(CACHE_REFERRAL, value)
}

export const canAcceptInvite = referral => {
  if (!profileRef.value || profileRef.value.inviter) {
    return false
  }

  return referral !== profileRef.value.referral
}

export const profile = readonly(profileRef)
export const referral = readonly(referralRef)
