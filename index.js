// package imports
const express = require('express');
const cors = require('cors');

// import routers
const userRouter = require('./routes/userRouter');
const basketRouter = require('./routes/basketRouter');
const productRouter = require('./routes/productsRouter');
const orderRouter = require('./routes/orderRoutes');

// create app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/users', userRouter);
app.use('/baskets', basketRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

// listen to port
app.listen(5000, () => {
    console.log('Commerce server now listening on port 5000');
})