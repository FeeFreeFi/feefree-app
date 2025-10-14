import type { Profile } from '@/types'
import { readonly, ref } from 'vue'
import { getProfile } from '@/api'
import { CACHE_REFERRAL } from '@/config'
import { setStorage } from '@/utils'

const profileRef = ref<Profile | undefined>()

const referralRef = ref('')

export async function fetchProfile() {
  const res = await getProfile()
  if (res.code !== 0) {
    console.log(res.message)
    return false
  }

  profileRef.value = res.data
  return true
}

export function resetProfile() {
  profileRef.value = undefined
}

export function saveReferral(value: string) {
  referralRef.value = value
  setStorage(CACHE_REFERRAL, value)
}

export function canAcceptInvite(referral: string) {
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
