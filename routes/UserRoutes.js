import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import { generateToken } from './utils.js'

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
  '/delete/:_id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params._id)
    if (user) {
      await user.remove()
      res.send({ message: 'User Deleted' })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//update user info
userRouter.put(
  '/:_id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params._id)
    console.log(`user found: ${user}`)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)

      const updatedUser = await user.save()
      res.send({ message: 'User Updated', user: updatedUser })
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
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    })
  })
)

//signin
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
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
