import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import productRouter from './routes/ProductRoutes.js'

dotenv.config()

mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to db')
  })
  .catch((err) => {
    console.log(err.message)
  })
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/product', productRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server has started at port:' + port)
})
