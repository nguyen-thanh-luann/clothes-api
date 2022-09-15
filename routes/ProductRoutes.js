import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

const productRouter = express.Router()

//number of elements in each page
const PAGE_SIZE = 4

// Get products
productRouter.get('/', async (req, res) => {
  let q = req.query
  let limit = q.limit || PAGE_SIZE
  let page = q.page || 1
  let category = q.category || ''
  let brand = q.brand || ''

  if (Object.keys(q).length !== 0) {
    page = parseInt(page)
    limit = parseInt(limit)

    if (page <= 0) {
      page = 1
    }
    if (limit <= 0) {
      limit = PAGE_SIZE
    }

    const searchQuery = {
      name: {
        $regex: q.query,
        $options: 'i',
      },
    }

    const categoryFilter =
      category && category !== ''
        ? {
            category: {
              $regex: category,
            },
          }
        : {}
    const brandFilter =
      brand && brand !== ''
        ? {
            brand: {
              $regex: brand,
            },
          }
        : {}

    const query = {
      ...searchQuery,
      ...categoryFilter,
      ...brandFilter,
    }

    let skipPro = (page - 1) * limit
    const products = await Product.find(query).skip(skipPro).limit(limit)
    const foundProduct = await Product.countDocuments(query)
    const countProducts = await Product.countDocuments()
    res.send({
      products,
      pages: Math.ceil(countProducts / limit),
      totalProduct: countProducts,
      foundProduct: foundProduct,
    })
  } else {
    //get all
    const countProducts = await Product.countDocuments()
    const products = await Product.find()
    res.send({ products, totalProduct: countProducts })
  }
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

//get all categories
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

//delete product
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

//update product
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
