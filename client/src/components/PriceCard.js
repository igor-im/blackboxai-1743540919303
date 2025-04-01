import React from 'react';

function PriceCard({ productId, price, volume, time, error }) {
  // Extract currency pair from product ID (e.g., "BTC-USD" -> "BTC")
  const currency = productId.split('-')[0];

  // Get currency icon class based on the currency
  const getCurrencyIcon = (curr) => {
    const icons = {
      'BTC': 'fab fa-bitcoin text-yellow-500',
      'ETH': 'fab fa-ethereum text-blue-400',
      'SOL': 'fas fa-sun text-purple-400',
      'MATIC': 'fas fa-polygon text-blue-500',
      'default': 'fas fa-coins text-yellow-500'
    };
    return icons[curr] || icons.default;
  };

  // Format price with appropriate decimals and commas
  const formatPrice = (p) => {
    if (!p) return 'N/A';
    const num = parseFloat(p);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format volume with appropriate decimals and commas
  const formatVolume = (v) => {
    if (!v) return 'N/A';
    const num = parseFloat(v);
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format timestamp
  const formatTime = (t) => {
    if (!t) return 'N/A';
    return new Date(t).toLocaleTimeString();
  };

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-50 rounded-xl p-6 backdrop-blur-lg border border-red-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{productId}</h3>
          <i className={getCurrencyIcon(currency)}></i>
        </div>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 backdrop-blur-lg border border-gray-700 shadow-xl transform hover:scale-105 transition-transform duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{currency}</h3>
        <i className={`text-2xl ${getCurrencyIcon(currency)}`}></i>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">Price</p>
        <p className="text-2xl font-bold text-white">{formatPrice(price)}</p>
      </div>

      {/* Volume */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">24h Volume</p>
        <p className="text-lg text-gray-200">{formatVolume(volume)}</p>
      </div>

      {/* Time */}
      <div className="text-right">
        <p className="text-xs text-gray-400">
          Last Updated: {formatTime(time)}
        </p>
      </div>
    </div>
  );
}

export default PriceCard;