// Existing imports and setup
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'VedGo#69', // Replace with your actual password
  database: 'inventory'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add a product
app.post('/api/products', (req, res) => {
  const { name, sku, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, sku, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, sku, category, price, quantity], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ error: 'Failed to insert product' });
    }
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  });
});

// Add a sales order
app.post('/api/sales', (req, res) => {
  const { productId, quantitySold } = req.body;

  // Insert into sales_orders table
  const saleQuery = 'INSERT INTO sales_orders (product_id, quantity_sold) VALUES (?, ?)';
  db.query(saleQuery, [productId, quantitySold], (err, result) => {
    if (err) {
      console.error('Error inserting sales order:', err);
      return res.status(500).json({ error: 'Failed to insert sales order' });
    }

    // Update product quantity
    const updateStockQuery = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
    db.query(updateStockQuery, [quantitySold, productId], (err2) => {
      if (err2) {
        console.error('Error updating stock:', err2);
        return res.status(500).json({ error: 'Failed to update stock' });
      }

      res.status(201).json({ message: 'Sales order added and stock updated' });
    });
  });
});

// Add a purchase order (missing route)
app.post('/api/purchase', (req, res) => {
  const { productId, quantityPurchased } = req.body;

  // Insert into purchase_orders table
  const purchaseQuery = 'INSERT INTO purchase_orders (product_id, quantity_purchased) VALUES (?, ?)';
  db.query(purchaseQuery, [productId, quantityPurchased], (err, result) => {
    if (err) {
      console.error('Error inserting purchase order:', err);
      return res.status(500).json({ error: 'Failed to insert purchase order' });
    }

    // Update product quantity
    const updateStockQuery = 'UPDATE products SET quantity = quantity + ? WHERE id = ?';
    db.query(updateStockQuery, [quantityPurchased, productId], (err2) => {
      if (err2) {
        console.error('Error updating stock:', err2);
        return res.status(500).json({ error: 'Failed to update stock' });
      }

      res.status(201).json({ message: 'Purchase order added and stock updated' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
