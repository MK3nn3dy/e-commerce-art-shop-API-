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
        const { type, piece_id, quantity, price } = req.body;

        // check if already in basket
        const existingItem = await pool.query("SELECT * FROM baskets WHERE user_id = $1 AND piece_id = $2", [id, piece_id]);

        // (row count is result rows from query above, so if it's over 0, the item is already in this users basket)
        if(existingItem.rowCount > 0){

            //check if added from home or updated from basket:
            if(type === 'ADD_TO_BASKET'){
                // get exisiting quantity in users basket
                existingQuantity = await (await pool.query('SELECT quantity FROM baskets WHERE user_id = $1 AND piece_id = $2', [id, piece_id])).rows[0].quantity;

                // add existing quantity to new amount to be added
                const newQuantity = Number(quantity) + Number(existingQuantity);
                
                // update on db
                const addToQuantity = await pool.query("UPDATE baskets SET quantity = $1, price = $4 WHERE user_id = $2 AND piece_id = $3", [newQuantity, id, piece_id, price]);

            } else if(type === 'UPDATE_QUANTITY'){

                // if update sent from number input inside basket, update quantity
                const IncrementDecrementQuantity = await pool.query("UPDATE baskets SET quantity = $1, price = $4 WHERE user_id = $2 AND piece_id = $3", [quantity, id, piece_id, price]);

            }

        } else {
            // add if product not in basket (row count 0 (else))
            addedItem = await pool.query("INSERT INTO baskets (user_id, piece_id, quantity, price) VALUES ($1, $2, $3, $4)", [id, piece_id, quantity, price]);
        }

        const stock = await (await pool.query('SELECT stock FROM pieces WHERE piece_id = $1', [piece_id])).rows[0].stock;
        const amountInBaskets = await (await pool.query('SELECT SUM(quantity) FROM baskets WHERE piece_id = $1', [piece_id])).rows[0].sum;
        const available = stock - amountInBaskets;
        const updateStock = await pool.query('UPDATE pieces SET available = $1 WHERE piece_id = $2', [available, piece_id]);
        // response
        res.status(200).json({message: "The item quantity was updated"})
    
    } catch (error) {
        // log error
        console.error(error.message);
        res.status(400).json({message: error.message});
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

            // quantity to make available again
            const newAvailability = itemToDelete.rows[0].quantity;

            // update availability in db
            const updateAvailability = await pool.query('UPDATE pieces SET available = available + $1 WHERE piece_id = $2', [newAvailability, piece_id])

            // delete if there are some
            const deletedItem = await pool.query("DELETE FROM baskets WHERE piece_id = $1 AND user_id = $2", [piece_id, id]);
            res.status(200).json({ message: "Item deleted from basket."})

            //update "available" on pieces table as these have been removed from basket


        } else {
            // error if there are none in basket.
            res.status(400).json({ message: "There are none of that item to delete in your basket!"});            
        }

    } catch (error) {
        console.error(error.message);
    }
};

const deleteBasket = async (req, res, next) => {

    try {
        const { user_id } = req.body;

        await pool.query('DELETE FROM baskets WHERE user_id = $1', [user_id]);
        res.status(200).json({message: 'Checked Out.'})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    

}

module.exports = {
    getUserBasket,
    updateBasket,
    deleteOneFromBasket,
    deleteBasket
}