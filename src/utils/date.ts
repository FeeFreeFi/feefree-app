import dayjs from 'dayjs'

export const getStamp = () => dayjs().unix()

export const isExpired = (exp: number) => getStamp() > exp
