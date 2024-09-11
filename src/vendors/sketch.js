const sketch = q => {
  const { createCanvas, resizeCanvas, background, translate, random, map, dist, norm, color, lerpColor, stroke, strokeWeight, line } = q

  const stars = []
  const RANGE = 100
  const SPEED = 5
  const COUNT = 400
  const SIZE = 1.1

  class Star {
    constructor() {
      this.reset()
    }

    reset() {
      const { width, height } = q

      this.x = random(-width * 3, width * 3)
      this.y = random(-height * 3, height * 3)
      this.z = random(width * 2, width * 4)
      this.px = this.x
      this.py = this.y
    }

    display() {
      const { width, height } = q
      const sx = map(this.x / this.z / 2, -1, 1, -width, width)
      const sy = map(this.y / this.z / 2, -1, 1, -height, height)
      const r = map(dist(sx, sy, this.px, this.py), 0, width / 2, SIZE, SIZE * 4)

      const n = map(RANGE, 0, 200, 0, width)
      const percent = norm(dist(sx, sy, 0, 0), 0, n)
      const from = color("#41f5cf")
      const to = color("#e7e368")
      const between = lerpColor(from, to, percent)

      stroke(between)
      strokeWeight(r)

      if (this.z >= 1 && sx <= width && sx > -width && sy > -height && sy < height) {
        line(this.px, this.py, sx, sy)
        this.px = sx
        this.py = sy
      }
    }

    update() {
      const { width, height } = q
      this.z -= SPEED
      if (this.z < 1) {
        this.reset()
        this.px = map(this.x / this.z / 2, -1, 1, -width, width)
        this.py = map(this.y / this.z / 2, -1, 1, -height, height)
      }
    }
  }

  const setup = () => {
    const { windowWidth, windowHeight } = q

    createCanvas(windowWidth, windowHeight)
    background(10)
    for (let i = 0; i < COUNT; i++) {
      stars.push(new Star())
    }
  }

  const draw = () => {
    const { width, height, frameCount } = q

    background(10, 10, 10, 30)

    if (frameCount < 10) {
      background(10)
    }

    translate(width / 2, height / 2)
    for (let star of stars) {
      star.update()
      star.display()
    }
  }

  const windowResized = () => {
    const { windowWidth, windowHeight } = q
    resizeCanvas(windowWidth, windowHeight)
  }

  q.draw = draw
  q.windowResized = windowResized

  setup()
}

export default sketch
