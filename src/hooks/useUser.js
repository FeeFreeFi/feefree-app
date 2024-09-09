import { getProfile } from "@/api"
import { CACHE_REFERRAL } from "@/config"
import { setStorage } from "@/utils/storage"
import { readonly, ref } from "vue"

/**
 * @type {import('vue').Ref<import('@/types').Profile>}
 */
const profileRef = ref(null)

const referralRef = ref('')

export const fetchProfile = async () => {
  const res = await getProfile()
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

/**
 * @param {string} referral
 */
export const canAcceptInvite = referral => {
  if (!profileRef.value) {
    return false
  }

  const { inviter, fans, referral: myReferral } = profileRef.value
  if (inviter || fans) {
    return false
  }

  return referral !== myReferral
}

export const profile = readonly(profileRef)
export const referral = readonly(referralRef)
