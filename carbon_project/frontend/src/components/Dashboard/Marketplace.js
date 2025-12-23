import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheckCircle, FiX } from 'react-icons/fi';
import localStorageService from '../../services/localStorageService';
import { ErrorHandler } from '../../utils/errorHandler';

const Marketplace = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState(null);

  const products = [
    {
      id: '1',
      title: 'Solar Panel Installation',
      description: 'Install solar panels to reduce electricity emissions',
      price: 50000,
      carbonOffset: 2.5,
      category: 'service',
      icon: '☀️',
    },
    {
      id: '2',
      title: 'Tree Planting',
      description: 'Plant 10 trees to offset carbon emissions',
      price: 1000,
      carbonOffset: 0.5,
      category: 'offset',
      icon: '🌳',
    },
    {
      id: '3',
      title: 'Electric Vehicle',
      description: 'Switch to electric vehicle',
      price: 500000,
      carbonOffset: 3.0,
      category: 'service',
      icon: '🚗',
    },
    {
      id: '4',
      title: 'Carbon Offset Certificate',
      description: 'Purchase verified carbon offset credits',
      price: 2000,
      carbonOffset: 1.0,
      category: 'offset',
      icon: '📜',
    },
    {
      id: '5',
      title: 'Energy Efficient Appliances',
      description: 'Upgrade to 5-star rated appliances',
      price: 30000,
      carbonOffset: 1.5,
      category: 'product',
      icon: '⚡',
    },
    {
      id: '6',
      title: 'Reusable Water Bottle',
      description: 'Reduce plastic waste',
      price: 500,
      carbonOffset: 0.1,
      category: 'product',
      icon: '💧',
    },
  ];

  const handlePurchase = (product) => {
    if (window.confirm(`Purchase ${product.title} for ₹${product.price.toLocaleString()}?`)) {
      try {
        // Save purchase
        localStorageService.savePurchase({
          productId: product.id,
          productName: product.title,
          offsetAmount: product.carbonOffset,
          purchaseDate: new Date().toISOString(),
        });

        // Award gamification points
        localStorageService.awardOffsetPoints(product.carbonOffset);

        setPurchasedProduct(product);
        setShowSuccess(true);
        ErrorHandler.showSuccess(`Purchase successful! ${product.carbonOffset}t CO₂ offset.`);

        // Auto-hide success after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setPurchasedProduct(null);
        }, 3000);
      } catch (error) {
        ErrorHandler.showError('Purchase failed: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <FiShoppingCart size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">Carbon Offset Marketplace 🛒</h1>
            <p className="text-emerald-50">Support eco-projects and offset your emissions</p>
          </div>
        </div>
      </motion.div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && purchasedProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <FiCheckCircle size={48} />
              <div>
                <h2 className="text-2xl font-bold mb-1">Purchase Successful! 🎉</h2>
                <p className="text-green-50">
                  You've offset {purchasedProduct.carbonOffset}t of CO₂ with {purchasedProduct.title}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{product.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Offset:</span>
                <span className="font-bold text-green-600">{product.carbonOffset}t CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                <span className="font-bold text-gray-800 dark:text-white">₹{product.price.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePurchase(product);
              }}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Purchase Offset
            </button>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedProduct.title}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{selectedProduct.icon}</div>
                <p className="text-gray-600 dark:text-gray-400">{selectedProduct.description}</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Carbon Offset:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {selectedProduct.carbonOffset}t CO₂
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Price:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  handlePurchase(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Purchase Now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;

