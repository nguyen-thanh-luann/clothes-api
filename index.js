import dotenv from 'dotenv'

import express from 'express'
import mongoose from 'mongoose'

dotenv.config()

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('connected to db')
  })
  .catch((err) => {
    console.log(err.message)
  })
const app = express()
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server has started at port:' + port)
})
