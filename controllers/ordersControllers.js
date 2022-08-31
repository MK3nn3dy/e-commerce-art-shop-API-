const pool = require('../dbconfig');
const { v4: uuidv4 } = require('uuid');



// on checkout, successful or failed
const addOrder = async (req, res, next) => {

    // async function for adding past_orders_pieces
    const addOrdersWithitems = async (order_id, piece_id, piece_quantity) => {
        await pool.query('INSERT INTO past_orders_pieces (order_id, piece_id, piece_quantity) VALUES ($1, $2, $3)', [order_id, piece_id, piece_quantity]);
    }

    // get array of order objects from request body
    const orderArray = req.body;

     // grab user ID from first in array
     const user_id = orderArray[0].user_id;

    // create new order ID
    const newOrderId = uuidv4();

    // add order_id and user_id into past orders
    await pool.query('INSERT INTO past_orders (user_id, order_id) VALUES($1, $2)', [user_id, newOrderId]);

    // add order id and items into past_orders_pieces
    orderArray.forEach((order) => {
        addOrdersWithitems(newOrderId, order.piece_id, order.quantity);
    })

    res.status(201).json({ orderId: newOrderId});
}

const getAllOrders = async (req, res, next) => {

}

const getSingleOrder = async (req, res, next) => {

}

module.exports = {
    getAllOrders,
    getSingleOrder,
    addOrder
}