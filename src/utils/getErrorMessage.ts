import { BaseError } from 'viem'

export const getErrorMessage = (err: unknown, defaultMessage: string) => {
  let message = defaultMessage
  if (err instanceof BaseError) {
    message = err.shortMessage || err.details || err.message
  } else if (err instanceof Error) {
    message = err.message
  }

  return message
}
