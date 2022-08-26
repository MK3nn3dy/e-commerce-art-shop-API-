const pool = require('../dbconfig');


// get users basket
const getUserBasket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userBasket = await pool.query("SELECT baskets.user_id, baskets.piece_id, baskets.quantity, pieces.description, pieces.img_url, pieces.price FROM baskets JOIN pieces ON baskets.piece_id = pieces.piece_id WHERE user_id = $1 ORDER BY 1", [id]);
        res.status(200).json(userBasket.rows);
    } catch (error) {
        console.error(error.message);
    }
};


// update / add to basket
const updateBasket = async (req, res, next) => {
    try {
        // get params (basket id)
        const { id } = req.params;

        // get piece id and quantity from body
        const { piece_id, quantity } = req.body;

        // check if already in basket
        const existingItem = await pool.query("SELECT * FROM baskets WHERE user_id = $1 AND piece_id = $2", [id, piece_id]);
        if(existingItem.rowCount > 0){
            // update if product already in basket (row count more than 0)
            updateQuantity = await pool.query("UPDATE baskets SET quantity = $1 WHERE user_id = $2 AND piece_id = $3", [quantity, id, piece_id]);
            res.status(200).json({message: "The item quantity was updated"})
        } else {
            // add if product not in basket (row count 0 (else))
            addedItem = await pool.query("INSERT INTO baskets (user_id, piece_id, quantity) VALUES ($1, $2, $3)", [id, piece_id, quantity]);
            res.status(200).json({message: "The item was added to your basket"})
        }
    
    } catch (error) {
        // log error
        console.error(error.message);
    }
}

// delete one from basket
const deleteOneFromBasket = async (req, res, next) => {
    try {
        // get params (basket id)
        const { id } = req.params;

        // get piece id from request body
        const { piece_id } = req.body;

        // check item is in basket to begin with (row count > 0)
        const itemToDelete = await pool.query("SELECT * FROM baskets WHERE piece_id = $1 AND user_id = $2", [piece_id, id]);
        if(itemToDelete.rowCount > 0){
            // delete if there are some
            const deletedItem = await pool.query("DELETE FROM baskets WHERE piece_id = $1 AND user_id = $2", [piece_id, id]);
            res.status(200).json({ message: "Item deleted from basket."})
        } else {
            // error if there are none in basket.
            res.status(400).json({ message: "There are none of that item to delete in your basket!"});            
        }

    } catch (error) {
        console.error(error.message);
    }
};

module.exports = {
    getUserBasket,
    updateBasket,
    deleteOneFromBasket
}