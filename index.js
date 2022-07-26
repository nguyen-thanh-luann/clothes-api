import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import productRouter from './routes/ProductRoutes.js'
import userRouter from './routes/UserRoutes.js'

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

// products
app.use('/api/product', productRouter)

//users
app.use('/api/user', userRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server has started at port:' + port)
})
