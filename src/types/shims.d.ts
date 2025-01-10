declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.module.scss' {
  const variables: Record<string, string | undefined>
  export = variables
}
