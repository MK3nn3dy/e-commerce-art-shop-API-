const Router = require('express').Router;

const { signup, login, deleteUser, updateUser } = require('../controllers/userControllers');
const requireAuth = require('../middleware/requireAuth');



const userRouter = Router();

// create user / signup
userRouter.post('/signup', signup)

// login
userRouter.post('/login', login)


// delete and update require auth
// delete user 
userRouter.delete('/:id', requireAuth, deleteUser)

// update user
userRouter.put('/:id', requireAuth, updateUser)


module.exports = userRouter;