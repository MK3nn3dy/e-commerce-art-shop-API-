// package imports
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const pool = require('./dbconfig');

// import routers
const userRouter = require('./routes/userRouter');
const basketRouter = require('./routes/basketRouter');
const productRouter = require('./routes/productsRouter');

// create app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/users', userRouter);
app.use('/baskets', basketRouter);
app.use('/products', productRouter);

// listen to port
app.listen(5000, () => {
    console.log('Commerce server now listening on port 5000');
})