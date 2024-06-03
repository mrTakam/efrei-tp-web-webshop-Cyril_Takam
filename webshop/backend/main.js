const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./models/productRoutes');
const { initProducts, Cart } = require('./manager');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/webshop', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());

// Initialize products in the database
initProducts();

// Create a new cart instance
const cart = new Cart();

// Routes
app.use('/api', productRoutes);

app.post('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  cart.addInCart(id);
  res.send(cart.getListCart());
});

app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  cart.removeFromCart(id);
  res.send(cart.getListCart());
});

app.get('/api/cart', (req, res) => {
  res.send(cart.getListCart());
});

app.get('/api/cart/total', async (req, res) => {
  const total = await cart.getTotalPrice();
  res.send({ total });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
