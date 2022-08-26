const Router = require('express').Router;

// import controller functions
const {
    getAllPieces, 
    getSinglePiece,
} = require('../controllers/productControllers')

const productRouter = Router();

// get all products
productRouter.get('/', getAllPieces);

// get single product
productRouter.get('/:id', getSinglePiece)

module.exports = productRouter;