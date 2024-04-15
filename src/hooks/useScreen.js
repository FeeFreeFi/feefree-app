import { readonly, ref } from "vue"
import debounce from "lodash-es/debounce"
import isMobile from "@/utils/isMobile"

const breakpoints = {
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

  let items = Object.keys(matches).filter(name => matches[name]).map(name => ({ name, size: breakpoints[name] }))
  items = items.sort((a, b) => b.size - a.size)
  const name = items[0].name

  const lt = Object.fromEntries(Object.entries(matches).map(([name, value]) => [name, !value]))

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

const onMediaChange = (e, name) => {
  matchesRef.value = {
    ...matchesRef.value,
    [name]: e.matches,
  }
  debounceUpdate()
}

const onWindowResize = () => {
  debounceResize()
}

const install = () => {
  Object.entries(breakpoints).forEach(([name, size]) => {
    const media  = window.matchMedia(`(min-width: ${size}px)`)
    media.addEventListener('change', e => onMediaChange(e, name))
    onMediaChange(media, name)
  })

  window.addEventListener("resize", onWindowResize)

  update()
}

export default install
