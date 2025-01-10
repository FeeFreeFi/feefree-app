import type { Profile } from '@/types'
import { readonly, ref } from 'vue'
import { getProfile } from '@/api'
import { CACHE_REFERRAL } from '@/config'
import { setStorage } from '@/utils'

const profileRef = ref<Profile | undefined>()

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
  profileRef.value = undefined
}

export const saveReferral = (value: string) => {
  referralRef.value = value
  setStorage(CACHE_REFERRAL, value)
}

export const canAcceptInvite = (referral: string) => {
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
