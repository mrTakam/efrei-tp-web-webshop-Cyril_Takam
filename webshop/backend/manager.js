const Product = require('./models/product');

// Initialize products in the database
const initProducts = async () => {
  const products = [
    { name: "Germinal 1", desc: "description germinal 1", price: 10 },
    { name: "Germinal 2", desc: "description germinal 2", price: 20 },
    { name: "Germinal 3", desc: "description germinal 3", price: 30 },
    { name: "Germinal 4", desc: "description germinal 4", price: 40 },
    { name: "Germinal 5", desc: "description germinal 5", price: 50 },
    { name: "Germinal 6", desc: "description germinal 6", price: 60 },
    { name: "Germinal 7", desc: "description germinal 7", price: 70 },
    { name: "Germinal 8", desc: "description germinal 8", price: 80 },
    { name: "Germinal 9", desc: "description germinal 9", price: 90 },
    { name: "Germinal 10", desc: "description germinal 10", price: 100 },
    { name: "Germinal 11", desc: "description germinal 11", price: 110 }
  ];

  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products initialized');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

class Cart {
  constructor() {
    this.list_cart = {};
  }

  getListCart() {
    return this.list_cart;
  }

  addInCart(id) {
    if (this.list_cart[id]) {
      this.list_cart[id]++;
    } else {
      this.list_cart[id] = 1;
    }
  }

  removeFromCart(id) {
    if (this.list_cart[id]) {
      if (this.list_cart[id] === 1) {
        delete this.list_cart[id];
      } else {
        this.list_cart[id]--;
      }
    }
  }

  getNbrProduct() {
    return Object.values(this.list_cart).reduce((acc, quantity) => acc + quantity, 0);
  }

  async getTotalPrice() {
    let total = 0;
    for (const id in this.list_cart) {
      const product = await Product.findById(id);
      total += this.list_cart[id] * product.price;
    }
    return total;
  }
}

module.exports = { initProducts, Cart };
