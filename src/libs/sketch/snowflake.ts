// @ts-expect-error ignore
import Snowflakes from '@/vendors/snowflakes'

async function snowflake(id: string) {
  return new Snowflakes({
    color: 'white',
    container: document.querySelector(id),
    minSize: 8,
    maxSize: 20,
    rotation: true,
    autoResize: true,
  })
}

export default snowflake
