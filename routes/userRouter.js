const Router = require('express').Router;

const { signup, login, deleteUser, updateUser } = require('../controllers/userControllers');

const userRouter = Router();

// create user / signup
userRouter.post('/signup', signup)

// login
userRouter.post('/login', login)

// delete user 
userRouter.delete('/:id', deleteUser)

// update user
userRouter.put('/:id', updateUser)


module.exports = userRouter;