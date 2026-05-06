require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const { saleOrchestrator, inventoryOrchestrator, reportOrchestrator } = require('./composition/container');
const saleRoutes = require('./infrastructure/routes/saleRoutes');
const inventoryRoutes = require('./infrastructure/routes/inventoryRoutes');
const reportRoutes = require('./infrastructure/routes/reportRoutes');

const app = express();

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: false,
});
app.set('view engine', 'njk');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/sale', saleRoutes(saleOrchestrator));
app.use('/inventory', inventoryRoutes(inventoryOrchestrator));
app.use('/reports', reportRoutes(reportOrchestrator));

// Root redirect
app.get('/', (req, res) => res.redirect('/sale'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`POS Frontend running on http://localhost:${PORT}`);
});

module.exports = app;
