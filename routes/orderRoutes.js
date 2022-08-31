const Router = require('express').Router;

// import controller functions
const {
    getAllOrders, 
    getSingleOrder,
    addOrder
} = require('../controllers/ordersControllers')

const orderRouter = Router();

// get all products
orderRouter.get('/', getAllOrders);

// get single product
orderRouter.get('/:id', getSingleOrder)

// add new order
orderRouter.post('/', addOrder);

module.exports = orderRouter;