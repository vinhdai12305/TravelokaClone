const express = require('express');
const app = express();

// ✅ connect DB
const connectDB = require('./config/db');
connectDB();

// 👉 dùng EJS
app.set('view engine', 'ejs');

// layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// routes
const locationRoutes = require('./routes/locationRoutes');
app.use('/locations', locationRoutes);

// static
app.use(express.static('public'));

// route
app.get('/', (req, res) => {
  res.render('hotels/list');
});

// server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});