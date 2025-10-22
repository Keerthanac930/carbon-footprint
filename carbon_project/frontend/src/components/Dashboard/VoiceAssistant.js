import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiVolume2 } from 'react-icons/fi';

const VoiceAssistantPage = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const handleVoiceInput = () => {
    setListening(!listening);
    if (!listening) {
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript("What's my footprint this month?");
        setResponse("Your carbon footprint for this month is 1.8 tonnes CO₂");
        setListening(false);
      }, 3000);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiVolume2 size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">Voice AI Assistant 🎤</h1>
            <p className="text-purple-50">Talk to your eco-assistant</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg text-center">
        <motion.button
          onClick={handleVoiceInput}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={listening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: listening ? Infinity : 0 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
            listening ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
          }`}
        >
          {listening ? <FiMicOff size={48} className="text-white" /> : <FiMic size={48} className="text-white" />}
        </motion.button>
        <p className="text-xl font-semibold text-gray-800 dark:text-white mt-6">
          {listening ? '🎤 Listening...' : 'Tap to speak'}
        </p>
        {transcript && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
            <p className="text-gray-800 dark:text-white font-medium">You: "{transcript}"</p>
          </motion.div>
        )}
        {response && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-xl">
            <p className="text-gray-800 dark:text-white">AI: {response}</p>
            <button onClick={() => speak(response)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
              <FiVolume2 className="inline mr-2" /> Speak Response
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistantPage;

