import MersenneTwister from 'mersenne-twister'

const COLORS = [
  '#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02', // gold
]

const mapChannel = (n: number, m: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')

const hex2hsl = (hex: string) => {
  // Convert hex to RGB first
  let r = Number.parseInt(`0x${hex.slice(1, 3)}`, 16)
  let g = Number.parseInt(`0x${hex.slice(3, 5)}`, 16)
  let b = Number.parseInt(`0x${hex.slice(5)}`, 16)
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h
  let s
  let l

  if (delta === 0) {
    h = 0
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6
  } else if (cmax === g) {
    h = (b - r) / delta + 2
  } else {
    h = (r - g) / delta + 4
  }

  h = Math.round(h * 60)

  if (h < 0) {
    h += 360
  }

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = Number((s * 100).toFixed(1))
  l = Number((l * 100).toFixed(1))

  return { h, s, l }
}

const hsl2hex = (hsl: { h: number, s: number, l: number }) => {
  const { h } = hsl
  let { s, l } = hsl
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return `#${mapChannel(r, m)}${mapChannel(g, m)}${mapChannel(b, m)}`
}

const colorRotate = (hex: string, degrees: number) => {
  const hsl = hex2hsl(hex)
  let hue = hsl.h
  hue = (hue + degrees) % 360
  hue = hue < 0 ? 360 + hue : hue
  hsl.h = hue
  return hsl2hex(hsl)
}

const genColor = (generator: MersenneTwister, colors: string[]) => {
  generator.random()
  const idx = Math.floor(colors.length * generator.random())
  return colors.splice(idx, 1)[0]
}

const genShape = (generator: MersenneTwister, colors: string[], size: number, i: number, total: number) => {
  const firstRot = generator.random()
  const angle = Math.PI * 2 * firstRot
  const velocity = (size / total) * generator.random() + (i * size) / total
  const tx = Math.cos(angle) * velocity
  const ty = Math.sin(angle) * velocity

  const secondRot = generator.random()
  const rot = firstRot * 360 + secondRot * 180
  const center = size / 2

  const transform = `translate(${tx} ${ty}) rotate(${rot.toFixed(1)} ${center} ${center})`
  const fill = genColor(generator, colors)

  return `<rect width="${size}" height="${size}" fill="${fill}" transform="${transform}" />`
}

const genSvg = (size: number, seed: number | number[]) => {
  const generator = new MersenneTwister(seed)

  const amount = generator.random() * 30 - 15
  const colors = COLORS.map(hex => colorRotate(hex, amount))

  const rects = [
    `<rect width="${size}" height="${size}" fill="${genColor(generator, colors)}" />`,
    genShape(generator, colors, size, 0, 3),
    genShape(generator, colors, size, 1, 3),
    genShape(generator, colors, size, 2, 3),
  ]

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${rects.join('')}</svg>`
}

export const jazzicon = (address: string, size = 64) => {
  const svg = genSvg(size, Number.parseInt(address.slice(2, 10), 16))
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
