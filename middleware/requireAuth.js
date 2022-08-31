const jwt = require('jsonwebtoken');
const pool = require('../dbconfig');

const requireAuth = async (req, res, next) => {

    // verify authentication
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]; // checked with console. This is token.

    try {

        // gets id from token using secret to reverse (deserializing)
        const {user_id} = jwt.verify(token, process.env.SECRET);

        const exists = await pool.query('SELECT user_id FROM users WHERE user_id = $1',[user_id]);
        req.user = exists.rows[0].user_id;
        next();
        

    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }

}

module.exports = requireAuth;