import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiCheckCircle } from 'react-icons/fi';

const OCRScanner = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    // Simulate OCR processing
    setTimeout(() => {
      setResult({
        products: ['Milk - 1L', 'Bread', 'Vegetables - 2kg'],
        totalEmissions: 4.5
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiCamera size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">OCR Bill Scanner 📷</h1>
            <p className="text-purple-50">Upload shopping bills to track product emissions</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer inline-flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
            <FiUpload size={48} className="text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">Click to upload bill</p>
        </label>
        {file && <p className="mt-4 text-green-600">Selected: {file.name}</p>}
        {file && <button onClick={handleScan} disabled={loading} className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold">{loading ? 'Scanning...' : 'Scan Bill'}</button>}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <FiCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Scan Complete!</h3>
          <div className="space-y-2">
            {result.products.map((p, i) => <p key={i} className="text-gray-700 dark:text-gray-300">• {p}</p>)}
          </div>
          <p className="mt-4 text-2xl font-bold text-center text-green-600">Total: {result.totalEmissions} kg CO₂</p>
        </motion.div>
      )}
    </div>
  );
};

export default OCRScanner;

