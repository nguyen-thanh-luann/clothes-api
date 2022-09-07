import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

const productRouter = express.Router()

//number of elements in each page
const PAGE_SIZE = 4

// Get products
productRouter.get('/', async (req, res) => {
  let limit = req.query.limit || 4
  let page = req.query.page

  if (page) {
    //get page (page can not smaller than 0)
    page = parseInt(page)
    limit = parseInt(limit)

    if (page <= 0) {
      page = 1
    }
    let skipPro = (page - 1) * limit
    const products = await Product.find().skip(skipPro).limit(limit)
    const countProducts = await Product.countDocuments()
    res.send({ products, pages: Math.ceil(countProducts / limit) })
  } else {
    //get all
    const products = await Product.find()
    res.send({ products })
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

//search product
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req
    const pageSize = query.pageSize || PAGE_SIZE
    const page = query.page || 1
    const category = query.category || ''
    const price = query.price || ''
    const rating = query.rating || ''
    const order = query.order || ''
    const searchQuery = query.query || ''

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {}
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 }

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize)

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    })
  })
)

export default productRouter
