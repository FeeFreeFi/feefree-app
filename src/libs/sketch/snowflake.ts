import '@/vendors/snowflakes'

const snowflake = (id: string) => {
  // @ts-expect-error ignore
  const _sketch = new window.Snowflakes({
    color: 'white',
    container: document.querySelector(id),
    minSize: 8,
    maxSize: 20,
    rotation: true,
    autoResize: true,
  })
}

export default snowflake
