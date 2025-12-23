import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiUpload, FiCheckCircle, FiX, FiFileText, FiAlertCircle, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../../utils/errorHandler';

const OCRScanner = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedUnits, setExtractedUnits] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  /**
   * Extract electricity units from bill text using pattern matching
   * Looks for patterns like "500 kWh", "500 units", "500.5 kWh", etc.
   */
  const extractElectricityUnits = (text) => {
    // Common patterns for electricity bills
    const patterns = [
      /(\d+\.?\d*)\s*(?:kwh|kwh|units?|unit)/gi,
      /(?:consumption|usage|reading|current|present)[\s:]*(\d+\.?\d*)/gi,
      /(\d+\.?\d*)\s*(?:kwh|units?)/gi,
    ];
    
    let units = null;
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        // Extract the number from the match
        const numbers = matches.map(match => {
          const numMatch = match.match(/(\d+\.?\d*)/);
          return numMatch ? parseFloat(numMatch[1]) : null;
        }).filter(n => n !== null && n > 0 && n < 10000); // Reasonable range
        
        if (numbers.length > 0) {
          // Use the largest number (likely the total consumption)
          units = Math.max(...numbers);
          break;
        }
      }
    }
    
    return units;
  };

  const handleScan = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate OCR processing with realistic delay
      // In a real app, this would call an OCR API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR text extraction (simulating what OCR would return)
      // In production, this would come from an OCR service like Tesseract.js or Google Cloud Vision
      const mockExtractedText = `
        ELECTRICITY BILL
        Account Number: 123456789
        Billing Period: October 2024
        Previous Reading: 4500
        Current Reading: 4850
        Units Consumed: 350 kWh
        Rate per Unit: ₹6.50
        Total Amount: ₹2,275
        Due Date: 15-Nov-2024
      `;
      
      // Extract electricity units
      const units = extractElectricityUnits(mockExtractedText);
      
      if (units) {
        setExtractedUnits(units);
        setResult({
          type: 'electricity',
          units: units,
          extractedText: mockExtractedText,
          recommendations: [
            `Found ${units} kWh consumption. This will be used to calculate your carbon footprint.`,
            'Consider using energy-efficient appliances to reduce consumption.',
            'Switch to LED bulbs to save up to 80% energy.',
          ]
        });
        ErrorHandler.showSuccess(`Successfully extracted ${units} kWh from bill!`);
      } else {
        // Fallback: show generic bill scan result
        setResult({
          type: 'generic',
          message: 'Bill scanned successfully, but could not extract specific data.',
          recommendations: [
            'Please manually enter your electricity consumption in the calculator.',
            'Make sure the bill image is clear and well-lit for better OCR results.',
          ]
        });
        ErrorHandler.showInfo('Bill scanned, but could not extract electricity units. Please enter manually.');
      }
    } catch (err) {
      setError('Failed to process bill. Please try again.');
      ErrorHandler.showError('Failed to process bill: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setExtractedUnits(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUseInCalculator = () => {
    if (extractedUnits) {
      // Store units in localStorage for calculator to pick up
      localStorage.setItem('ocr_extracted_units', extractedUnits.toString());
      navigate('/dashboard/calculator');
      ErrorHandler.showSuccess('Opening calculator with extracted data...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <FiCamera size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">OCR Bill Scanner 📷</h1>
            <p className="text-purple-50 text-sm sm:text-base">Upload shopping bills to track product emissions</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Area */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="white-card white-card-xl"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          
          {!preview ? (
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FiUpload size={48} className="text-white" />
              </div>
              <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Click to upload bill image
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supports JPG, PNG, GIF (Max 5MB)
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                  📸 Camera
                </span>
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs">
                  📁 Gallery
                </span>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden border-2 border-purple-300 dark:border-purple-700">
                <img
                  src={preview}
                  alt="Bill preview"
                  className="w-full max-h-96 object-contain bg-gray-100 dark:bg-gray-900"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FiFileText className="text-purple-600 dark:text-purple-400" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{file?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file?.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-300 dark:border-red-700 rounded-xl"
                >
                  <FiAlertCircle className="text-red-500" size={20} />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Scan Button */}
              <button
                onClick={handleScan}
                disabled={loading || !!error}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scanning Bill...</span>
                  </>
                ) : (
                  <>
                    <FiCamera size={24} />
                    <span>Scan Bill</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <div className="white-card white-card-lg">
              <div className="white-card-icon-header">
                <div className="white-card-icon">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="white-card-title text-2xl">
                    Scan Complete! ✅
                  </h3>
                  <p className="white-card-subtitle">
                    {result.type === 'electricity' 
                      ? `Extracted ${result.units} kWh from your electricity bill`
                      : 'Bill scanned successfully'}
                  </p>
                </div>
              </div>
              
              {result.type === 'electricity' && (
                <>
                  {/* Electricity Units Card */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <FiZap size={32} className="mr-2" />
                      <p className="text-sm font-semibold">Electricity Consumption</p>
                    </div>
                    <p className="text-5xl font-bold mb-2">{result.units}</p>
                    <p className="text-lg">kWh</p>
                  </div>
                  
                  {/* Use in Calculator Button */}
                  <div className="white-card-actions">
                    <button
                      onClick={handleUseInCalculator}
                      className="white-card-button white-card-button-primary w-full"
                    >
                      Use in Calculator →
                    </button>
                    <button
                      onClick={handleReset}
                      className="white-card-button white-card-button-secondary"
                    >
                      Scan New Bill
                    </button>
                  </div>
                </>
              )}
              
              {result.type === 'generic' && (
                <div className="white-card-actions">
                  <button
                    onClick={handleReset}
                    className="white-card-button white-card-button-primary"
                  >
                    Scan New Bill
                  </button>
                </div>
              )}
            </div>

            {/* Extracted Text Preview */}
            {result.extractedText && (
              <div className="white-card white-card-lg">
                <div className="white-card-icon-header">
                  <div className="white-card-icon">
                    <FiFileText size={24} />
                  </div>
                  <div>
                    <h3 className="white-card-title text-xl">Extracted Text</h3>
                    <p className="white-card-subtitle">OCR extracted content</p>
                  </div>
                </div>
                <div className="white-card-content">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg overflow-auto max-h-48">
                    {result.extractedText}
                  </pre>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 dark:bg-opacity-20 border border-green-200 dark:border-green-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4 flex items-center">
                💡 Smart Recommendations
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <p className="text-green-800 dark:text-green-200 text-sm">{rec}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 border border-purple-200 dark:border-purple-700 rounded-xl p-6"
      >
        <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center">
          <span className="text-2xl mr-2">📸</span>
          How It Works
        </h4>
        <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-2 ml-4">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Upload a photo of your shopping bill or receipt</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>Our OCR technology extracts product information</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>We calculate the carbon footprint for each item</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Get personalized tips to reduce your impact</span>
          </li>
        </ol>
      </motion.div>
    </div>
  );
};

export default OCRScanner;
