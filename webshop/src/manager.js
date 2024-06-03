// File: manager.js

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schemas and Models
const productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
});

const cartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
});

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Routes

// Add a product
app.post('/products', async (req, res) => {
    const { name, desc, price } = req.body;
    const product = new Product({ name, desc, price });
    await product.save();
    res.status(201).send(product);
});

// Get all products
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
});

// Add item to cart
app.post('/cart/:id', async (req, res) => {
    const { id } = req.params;
    const cartItem = await Cart.findOne({ productId: id });

    if (cartItem) {
        cartItem.quantity += 1;
        await cartItem.save();
    } else {
        const newCartItem = new Cart({ productId: id, quantity: 1 });
        await newCartItem.save();
    }

    res.status(200).send('Item added to cart');
});

// Remove item from cart
app.delete('/cart/:id', async (req, res) => {
    const { id } = req.params;
    const cartItem = await Cart.findOne({ productId: id });

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        } else {
            await Cart.deleteOne({ productId: id });
        }
    }

    res.status(200).send('Item removed from cart');
});

// Get all items in cart
app.get('/cart', async (req, res) => {
    const cartItems = await Cart.find().populate('productId');
    res.send(cartItems);
});

// Get total number of products in cart
app.get('/cart/total-products', async (req, res) => {
    const cartItems = await Cart.find();
    const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    res.send({ totalProducts });
});

// Get total price of the cart
app.get('/cart/total-price', async (req, res) => {
    const cartItems = await Cart.find().populate('productId');
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
    res.send({ totalPrice });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
