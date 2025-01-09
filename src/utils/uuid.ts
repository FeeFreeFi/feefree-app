const CHARS = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

const randomChar = () => CHARS[0 | Math.random() * 58]

export const uuid = (length = 6) => Array.from({ length }).map(randomChar).join('')
