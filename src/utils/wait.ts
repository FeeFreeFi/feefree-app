export function wait(delay: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), delay)
  })
}
