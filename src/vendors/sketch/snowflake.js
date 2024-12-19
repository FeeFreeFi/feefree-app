import "../lib/snowflakes"

const snowflake = id => {
  new Snowflakes({
    color: 'white',
    container: document.querySelector(id),
    minSize: 8,
    maxSize: 20,
    rotation: true,
    autoResize: true,
  })
}

export default snowflake
