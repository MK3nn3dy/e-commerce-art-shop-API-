const pool = require('../dbconfig');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// create token function (to be reused)
const createToken = (newId) => {
    return jwt.sign({ user_id: newId }, process.env.SECRET, {expiresIn: '3d'})
}


// login
const login = async (req, res, next) => {

    try {

        // destructure email and password from req body (added by express.json() middleware)
        const { email, password } = req.body;

        // validation
        if(!email || !password){
            throw Error('All fields must be filled');
        }

        // check if email is registered
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if(user.rowCount === 0){
            throw Error("Incorrect Email");
        }

        const dbHashedPassword = await pool.query('SELECT password FROM users WHERE user_email = $1', [email]);

        const match = await bcrypt.compare(password, dbHashedPassword.rows[0].password);
        console.log(match)

        if(!match){
            throw Error('Incorrect Password')
        }

        // create token
        const token = createToken(user.rows[0].user_id);

        res.status(200).json({ user: user.rows[0].user_id, email, token });
        
    } catch (error) {
        res.status(400).json({ message: error.message});
    }

}


// signup
const signup = async (req, res, next) => {

    try {

        // destructure email and password from req body (added by express.json() middleware)
        const { email, password, first, last, username } = req.body;

        // validation
        if(!email || !password){
            throw Error('All fields must be filled');
        }

        if(!validator.isEmail(email)){
            throw Error('Email is not valid');
        }

        if(!validator.isStrongPassword(password)){
            throw Error('Password is not strong enough')
        }

        // check if email already in postgresql db
        const exists = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if(exists.rowCount > 0){
            throw Error("Email already in use");
        }

        // generate salt and hash with password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // add to db with SQL query (using hash as password)
        const newUser = await pool.query('INSERT INTO users (user_email, user_first_name, user_last_name, username, password) VALUES($1, $2, $3, $4, $5)', [email, first, last, username, hash])

        // get new user_id using email
        const newUserId = await pool.query('SELECT user_id FROM users WHERE user_email = $1', [email])
        console.log(newUserId.rows[0].user_id);

        // create token passing in new users ID
        const token = createToken(newUserId.rows[0].user_id);

        // sending newUser returned by psql query
        res.status(200).json({ newUserId: newUserId.rows[0].user_id, email, token });
        
    } catch (error) {
        res.status(400).json({ message: error.message});
    }

}


// delete user
const deleteUser = async (req, res, next) => {
    res.status(200).json({ message: "User " + req.params.id + " deleted."})
}


// update user
const updateUser = async (req, res, next) => {
    res.status(200).json({ message: "User " + req.params.id + " updated."})
}

module.exports = {
    login,
    signup,
    deleteUser,
    updateUser
}