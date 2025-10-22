import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your eco-assistant. Ask me about reducing your carbon footprint!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "That's a great question! Based on your profile, I recommend...", sender: 'bot' }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiMessageCircle size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Eco Chatbot 🤖</h1>
            <p className="text-cyan-50">Get personalized sustainability advice</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg h-[600px] flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white" />
            <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow">
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

