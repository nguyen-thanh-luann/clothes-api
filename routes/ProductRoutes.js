import express from 'express'
import Product from '../models/Product.js'

const productRouter = express.Router()

// Get all products
productRouter.get('/', async (req, res) => {
  const posts = await Product.find()
  res.send(posts)
})

// Get product by id
productRouter.get('/:id', async (req, res) => {
  const post = await Product.findById(req.params.id)
  if (post) {
    res.send(post)
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})

//add new Products
productRouter.post('/', async (req, res) => {
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

productRouter.delete('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  console.log(`product: ${product}`)
  if (product) {
    await product.remove()
    res.send({ message: 'Product Deleted' })
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})

productRouter.put('/:id', async (req, res) => {
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

export default productRouter
