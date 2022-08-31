const { getUserBasket,
        updateBasket,
        deleteOneFromBasket,
        deleteBasket
    } = require('../controllers/basketControllers');

const requireAuth = require('../middleware/requireAuth');


const Router = require('express').Router;

const basketRouter = Router();

// basket table is just product IDs paired with user IDs

// require authorization for all basket routes
basketRouter.use(requireAuth);

// get users basket items
basketRouter.get('/:id', getUserBasket);

// add single product to users basket
basketRouter.post('/:id', updateBasket);

// delete one product from users basket
basketRouter.delete('/:id', deleteOneFromBasket);

basketRouter.delete('/', deleteBasket);

// update single order in users basket

module.exports = basketRouter;