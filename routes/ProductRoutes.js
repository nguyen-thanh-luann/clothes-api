import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

const productRouter = express.Router()
const PAGE_SIZE = 3

// Get all products
productRouter.get('/', async (req, res) => {
  const products = await Product.find()
  res.send(products)
})

// Get product by id
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})

//get add categories
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
  })
)

//add new Products
productRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      reviews: req.body.reviews,
    })

    await newProduct.save()
    res.send(newProduct)
  })
)

productRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      await product.remove()
      res.send({ message: 'Product Deleted' })
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

productRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      ;(product.name = req.body.name),
        (product.description = req.body.description),
        (product.image = req.body.image),
        (product.images = req.body.images),
        (product.brand = req.body.brand),
        (product.category = req.body.category),
        (product.price = req.body.price),
        (product.countInStock = req.body.countInStock),
        (product.rating = req.body.rating),
        (product.numReviews = req.body.numReviews),
        (product.reviews = req.body.reviews),
        await product.save()
      res.send({ message: 'Product Updated' })
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

export default productRouter
