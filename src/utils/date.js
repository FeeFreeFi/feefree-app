import dayjs from "dayjs"

export const getStamp = () => dayjs().unix()

export const isExpired = exp => getStamp() > exp
