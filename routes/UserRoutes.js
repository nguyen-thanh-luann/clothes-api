import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import { generateToken, isAdmin, isAuth } from '../utils.js'
import Product from '../models/Product.js'

const userRouter = express.Router()
// Get all users
userRouter.get('/', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

// Get user by id
userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.send(user)
  } else {
    res.status(404).send({ message: 'User Not Found' })
  }
})

//delete user
userRouter.delete(
  '/delete/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      await user.remove()
      res.send({ message: 'User Deleted' })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//add product to wishlist
userRouter.put(
  '/addWishlist',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.query.userId)
    const product = await Product.findById(req.query.productId)
    if (user) {
      const productExist = await user.wishlist.forEach((item) => {
        if (item._id === req.query.productId) {
          return true
        } else {
          return false
        }
      })
      if (productExist) {
        res.status(404).send({ message: 'Product Existed' })
      } else {
        user.wishlist.push(product)
        const updatedUser = await user.save()
        res.send({
          _id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          wishlist: updatedUser.wishlist,
          phone: updatedUser.phone,
          address: updatedUser.address,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        })
      }
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//remove product from wishlist
userRouter.put(
  '/removeWishlist',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.query.userId)
    if (user) {
      user.wishlist = user.wishlist.filter(
        (item) => item._id.toString() !== req.query.productId
      )

      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        wishlist: updatedUser.wishlist,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//update user info
userRouter.put(
  '/update',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.query.id)
    if (user) {
      user.name = req.query.name || user.name
      user.phone = req.query.phone || user.phone || ''
      user.address = req.query.address || user.address || ''
      if (req.query.password && req.query.password.trim().length != 0) {
        user.password = bcrypt.hashSync(req.query.password, 8)
      }

      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        wishlist: updatedUser.wishlist,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      })
      return
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//signup
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    })
    const user = await newUser.save()

    res.send(user)
  })
)

//login
userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          wishlist: user.wishlist,
          address: user.address,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        })
        return
      } else {
        res.status(404).send({ message: 'Wrong password' })
        return
      }
    } else {
      res.status(401).send({ message: 'User not exist' })
    }
  })
)

export default userRouter
