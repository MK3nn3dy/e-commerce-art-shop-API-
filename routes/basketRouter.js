const { getUserBasket,
        updateBasket,
        deleteOneFromBasket } = require('../controllers/basketControllers');
const pool = require('../dbconfig');

const Router = require('express').Router;

const basketRouter = Router();

// basket table is just product IDs paired with user IDs


// get users basket items
basketRouter.get('/:id', getUserBasket);

// add single product to users basket
basketRouter.post('/:id', updateBasket);

// delete one product from users basket
basketRouter.delete('/:id', deleteOneFromBasket);

// update single order in users basket

module.exports = basketRouter;