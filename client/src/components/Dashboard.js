import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceCard from './PriceCard';

function Dashboard({ isAuthenticated }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/prices');
      setPrices(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency prices');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-75 text-white p-4 rounded-lg shadow-lg mx-auto max-w-2xl mt-8">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Live Cryptocurrency Prices
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track real-time prices of major cryptocurrencies. Data updates automatically every 30 seconds.
        </p>
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {prices.map((price) => (
          <PriceCard
            key={price.product_id}
            productId={price.product_id}
            price={price.price}
            volume={price.volume}
            time={price.time}
            error={price.error}
          />
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-8">
        <button
          onClick={fetchPrices}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <i className="fas fa-sync-alt"></i>
          <span>Refresh Prices</span>
        </button>
      </div>

      {/* Authentication CTA */}
      {!isAuthenticated && (
        <div className="mt-12 bg-gray-800 bg-opacity-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Want More Features?</h2>
          <p className="text-gray-300 mb-6">
            Sign up to create your own watchlist, set price alerts, and track your portfolio!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Sign Up Now
            </a>
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;