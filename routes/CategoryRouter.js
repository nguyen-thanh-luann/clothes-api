import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

const categoryRouter = express.Router()

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
  })
)

export default categoryRouter
