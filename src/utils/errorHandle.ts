import type { App } from 'vue'

export function errorHandle(app: App) {
  app.config.errorHandler = (err: unknown) => {
    console.log(err)
  }
}
