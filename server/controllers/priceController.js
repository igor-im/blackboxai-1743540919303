const axios = require('axios');

const COINBASE_API_URL = 'https://api.exchange.coinbase.com';

// Get list of available crypto products
const getProducts = async () => {
    try {
        const response = await axios.get(`${COINBASE_API_URL}/products`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }
};

// Get current price for a specific product
const getProductPrice = async (productId) => {
    try {
        const response = await axios.get(`${COINBASE_API_URL}/products/${productId}/ticker`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch price for ${productId}: ${error.message}`);
    }
};

// Controller methods for route handlers
const priceController = {
    // Get prices for major cryptocurrencies
    async getPrices(req, res) {
        try {
            // List of major crypto pairs to track
            const majorPairs = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'MATIC-USD'];
            
            // Fetch prices for all major pairs
            const pricePromises = majorPairs.map(async (pair) => {
                try {
                    const priceData = await getProductPrice(pair);
                    return {
                        product_id: pair,
                        price: priceData.price,
                        volume: priceData.volume,
                        time: priceData.time
                    };
                } catch (error) {
                    console.error(`Error fetching ${pair}:`, error);
                    return {
                        product_id: pair,
                        error: 'Price temporarily unavailable'
                    };
                }
            });

            const prices = await Promise.all(pricePromises);
            
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                data: prices
            });
        } catch (error) {
            console.error('Price controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch cryptocurrency prices'
            });
        }
    },

    // Get all available products
    async getAllProducts(req, res) {
        try {
            const products = await getProducts();
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch available products'
            });
        }
    }
};

module.exports = priceController;