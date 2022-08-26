const pool = require('../dbconfig');

// get all art pieces
const getAllPieces = async (req, res, next) => {
        try {
            const pieces = await pool.query(
                "SELECT * FROM pieces"
            );
            res.status(200).json(pieces.rows);
        } catch (error) {
            console.log(error.message);
        }
};


// get single art piece
const getSinglePiece = async (req, res, next) => {
    try {
        const piece_id = req.params.id; // could also have been destructured in braces as equal to req.params - tested.
        const piece = await pool.query(
            "SELECT * FROM pieces WHERE piece_id = $1", [piece_id]
        );
        res.status(200).json(piece.rows[0]);
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    getAllPieces,
    getSinglePiece,
}