// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

module.exports = server; // EXPORT YOUR SERVER instead of {}

//post /api/users Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
  if (!req.body.name || !req.body.bio){
    res.status(400).json({ message: 'Please provide name and bio for the user' })
  } else {
    const { name, bio } = req.body
    User.insert({ name, bio })
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(500).json({
          message: err.message,
        })
      })
  }
})

//get /api/users Returns an array users.
server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      })
    })
})

//get /api/users/:id	Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id
  User.findById(id)
    .then(user => {
      if (!user){
        res.status(404).json({ message: "The user with the specified ID does not exist"})
      } else {
        res.status(200).json(user)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      })
    })
})

//delete /api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', async (req, res) => {
  try {
    const posUser = await User.findById(req.params.id)
    if (!posUser){
      res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
      const deletedUser = await User.remove(posUser.id)
      res.status(200).json(deletedUser)
    } 
  } catch (err) {
    res.status(500).json({
      message: 'error deleting user'
    })
  }
})

//put /api/users/:id Updates the user with the specified id using data from the request body. Returns the modified user

server.put('/api/users/:id', async (req, res) => {
  // const { id } = req.params
  // const { name, bio } = req.body
  // const posUser = User.findById(req.params.id)
  // if (!posUser){
  //   res.status(404).json({ message: "The user with the specified ID does not exist"})
  // }
  // if (!posUser.name || !posUser.bio){
  //   res.status(400).json({ message: "Please provide name and bio for the user" })
  // } else {
  //   User.update(id, { name, bio })
  //     .then(updatedU => {
  //       res.json(updatedU)
  //     })
  // }
  try {
    const posUser = await User.findById(req.params.id)
    if (!posUser){
      res.status(404).json({
        message: 'The user with the specified ID does not exist'
      })
    } else {
      if(!req.body.name || !req.body.bio) {
        res.status(400).json({
          message: 'Please provide name and bio for the user'
        })
      } else {
        const updatedUser = await User.update(req.params.id, req.body)
        res.status(200).json(updatedUser)
      }
    }
  } catch (err) {
    res.status(500).json({
      message: 'error updating user',
      err: err.message,
      stack: err.stack
    })
  }
})