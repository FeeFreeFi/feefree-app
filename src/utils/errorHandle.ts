import type { App } from 'vue'

export const errorHandle = (app: App) => {
  app.config.errorHandler = (err: unknown) => {
    console.log(err)
  }
}
