const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const accountController = require('../controllers/accountController');

// Price routes
router.get('/prices', priceController.getPrices);
router.get('/products', priceController.getAllProducts);

// Account routes
router.post('/signup', accountController.signup);
router.post('/login', accountController.login);
router.get('/profile/:id', accountController.getProfile);

// Health check route
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;