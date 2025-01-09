import { readonly, ref } from "vue"
import { debounce } from "lodash-es"
import { isMobile } from "@/utils"

type MediaSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

type MediaMatch = {
  [key in MediaSize]: boolean;
}

type Breakpoints = {
  [key in MediaSize]: number;
}

const breakpoints: Breakpoints = {
  xs: 0,
  sm : 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

const matchesRef = ref({
  xs: true,
  sm : false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
})

const screenRef = ref({
  name: "",
  breakpoints,
  ...matchesRef.value,
  lt: {
    xs: false,
    sm : true,
    md: true,
    lg: true,
    xl: true,
    "2xl": true,
  },
  isMobile: isMobile(),
})
export const screen = readonly(screenRef)

const update = () => {
  const matches = matchesRef.value

  let items = Object.keys(matches).filter(name => matches[name as MediaSize]).map(name => ({ name, size: breakpoints[name as MediaSize] }))
  items = items.sort((a, b) => b.size - a.size)
  const name = items[0].name

  const lt = Object.fromEntries(Object.entries(matches).map(([name, value]) => [name, !value])) as MediaMatch

  screenRef.value = {
    ...screenRef.value,
    name,
    ...matches,
    lt,
    isMobile: isMobile(),
  }
}

const resize = () => {
  screenRef.value = {
    ...screenRef.value,
    isMobile: isMobile(),
  }
}

const debounceUpdate = debounce(update, 50, { leading: false, trailing: true })
const debounceResize = debounce(resize, 50, { leading: false, trailing: true })

const onMediaChange = (name: string, matches: boolean) => {
  matchesRef.value = {
    ...matchesRef.value,
    [name]: matches,
  }
  debounceUpdate()
}

const onWindowResize = () => {
  debounceResize()
}

const install = () => {
  Object.entries(breakpoints).forEach(([name, size]) => {
    const media  = window.matchMedia(`(min-width: ${size}px)`)
    media.addEventListener('change', e => onMediaChange(name, e.matches))
    onMediaChange(name, media.matches)
  })

  window.addEventListener("resize", onWindowResize)

  update()
}

export default install
