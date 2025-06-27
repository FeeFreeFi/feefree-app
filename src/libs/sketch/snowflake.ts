// @ts-expect-error ignore
import Snowflakes from '@/vendors/snowflakes'

const snowflake = async (id: string) => {
  const _sketch = new Snowflakes({
    color: 'white',
    container: document.querySelector(id),
    minSize: 8,
    maxSize: 20,
    rotation: true,
    autoResize: true,
  })
}

export default snowflake
