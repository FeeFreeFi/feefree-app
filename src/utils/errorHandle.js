const errorHandle = app => {
  app.config.errorHandler = err => {
    console.log(err)
  }
}

export default errorHandle
