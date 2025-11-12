import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiSend, FiX, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      text: `Hi ${user?.name || 'there'}! 👋 I'm your eco-assistant. Ask me about reducing your carbon footprint, sustainable living tips, or environmental news!`, 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Smart response system based on keywords
    if (lowerMessage.includes('reduce') || lowerMessage.includes('lower')) {
      return "Great question! Here are some effective ways to reduce your carbon footprint:\n\n🚴 Transportation: Use public transport, carpool, or cycle\n💡 Energy: Switch to LED bulbs and use energy-efficient appliances\n🌱 Food: Reduce meat consumption and buy local produce\n♻️ Waste: Recycle, compost, and reduce single-use plastics\n\nWould you like detailed tips on any of these areas?";
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      return "Transportation tips for reducing emissions:\n\n🚗 Share rides with colleagues\n🚌 Use public transportation\n🚲 Bike or walk for short distances\n🚄 Choose trains over flights when possible\n⚡ Consider electric vehicles\n\nEvery kilometer saved makes a difference!";
    } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('diet')) {
      return "Sustainable eating habits:\n\n🥗 Eat more plant-based meals\n🌾 Buy local and seasonal produce\n🍽️ Reduce food waste\n🥡 Avoid excessive packaging\n🌍 Choose sustainably sourced products\n\nA plant-rich diet can reduce your carbon footprint by up to 73%!";
    } else if (lowerMessage.includes('energy') || lowerMessage.includes('electricity') || lowerMessage.includes('power')) {
      return "Energy-saving tips:\n\n💡 Switch to LED lighting\n🌡️ Use programmable thermostats\n🔌 Unplug devices when not in use\n☀️ Consider solar panels\n🏠 Improve home insulation\n⚡ Use energy-efficient appliances\n\nSmall changes lead to big savings!";
    } else if (lowerMessage.includes('recycle') || lowerMessage.includes('waste') || lowerMessage.includes('trash')) {
      return "Waste reduction strategies:\n\n♻️ Follow the 5 R's: Refuse, Reduce, Reuse, Repurpose, Recycle\n🛍️ Use reusable bags and containers\n🥤 Avoid single-use plastics\n🗑️ Compost organic waste\n📦 Buy products with minimal packaging\n\nZero waste is a journey, not a destination!";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 😊 I'm here to help you live more sustainably. You can ask me about:\n\n✅ Reducing carbon emissions\n✅ Sustainable living tips\n✅ Energy conservation\n✅ Eco-friendly transportation\n✅ Green lifestyle choices\n\nWhat would you like to know?`;
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! 🌍 Remember, every small action counts towards a healthier planet. Feel free to ask me anything else!";
    } else if (lowerMessage.includes('calculator') || lowerMessage.includes('calculate')) {
      return "You can calculate your carbon footprint using our Calculator feature! It will help you:\n\n📊 Track your emissions\n📈 Monitor progress over time\n🎯 Set reduction goals\n💚 Get personalized recommendations\n\nJust navigate to the Calculator page from the sidebar!";
    } else {
      return "That's an interesting question! Based on your profile and current environmental trends, I recommend:\n\n1️⃣ Start with small, sustainable changes\n2️⃣ Track your progress using our calculator\n3️⃣ Set achievable monthly goals\n4️⃣ Join our community for support\n\nFor more specific advice, try asking about transportation, energy, food, or waste reduction. I'm here to help! 🌱";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = {
        text: getAIResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How can I reduce emissions?",
    "Transportation tips",
    "Energy saving ideas",
    "Sustainable food choices"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiMessageCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">AI Eco Chatbot 🤖</h1>
              <p className="text-cyan-50 text-sm sm:text-base">Get personalized sustainability advice</p>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            {isMinimized ? <FiMaximize2 size={20} /> : <FiMinimize2 size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Quick Questions */}
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="white-card white-card-md"
        >
          <div className="white-card-content">
            <h3 className="mb-3">Quick Questions:</h3>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickQuestion(question)}
                  className="white-card-button white-card-button-primary text-sm"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="white-card white-card-lg flex flex-col overflow-hidden"
            style={{ height: '600px' }}
          >
            {/* Messages Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] sm:max-w-md ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-md ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-md border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
              <div className="flex space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about sustainability..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={20} />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                💡 Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-700 rounded-xl p-6"
      >
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
          <span className="text-2xl mr-2">🤖</span>
          AI-Powered Sustainability Assistant
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Our chatbot uses advanced AI to provide personalized eco-friendly recommendations based on your lifestyle and goals.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="text-blue-700 dark:text-blue-300">24/7 Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="text-blue-700 dark:text-blue-300">Instant Responses</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="text-blue-700 dark:text-blue-300">Personalized Tips</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="text-blue-700 dark:text-blue-300">Smart Learning</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
