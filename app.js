const express = require('express');
const app = express();

// 👉 dùng EJS
app.set('view engine', 'ejs');

// 👉 layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// 👉 static images
app.use(express.static('public'));

// 👉 route
app.get('/', (req, res) => {
  res.render('hotels/list');
});

// 👉 chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});