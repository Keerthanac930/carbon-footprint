import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiExternalLink, FiRefreshCw, FiCalendar } from 'react-icons/fi';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'india', 'global'

  useEffect(() => {
    loadNews();
  }, [filter]);

  const loadNews = async () => {
    setLoading(true);
    try {
      // Simulated news data (In production, replace with actual API calls)
      // For NewsAPI: https://newsapi.org/v2/everything?q=climate+change+sustainability&apiKey=YOUR_KEY
      // For GNews: https://gnews.io/api/v4/search?q=climate+change&token=YOUR_TOKEN
      
      const mockNewsData = [
        {
          title: 'India Sets Ambitious Renewable Energy Target for 2030',
          description: 'India announces plans to achieve 500GW of renewable energy capacity by 2030, marking a significant step in combating climate change.',
          source: 'The Hindu',
          url: 'https://www.thehindu.com',
          publishedAt: '2024-10-20T10:30:00Z',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
          category: 'india'
        },
        {
          title: 'Global Carbon Emissions Reach Record High in 2024',
          description: 'New report shows global CO₂ emissions have reached unprecedented levels, urging immediate action from world leaders.',
          source: 'BBC News',
          url: 'https://www.bbc.com/news',
          publishedAt: '2024-10-19T14:20:00Z',
          image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b7?w=400',
          category: 'global'
        },
        {
          title: 'Mumbai Launches Electric Bus Fleet to Reduce Urban Pollution',
          description: 'Mumbai introduces 500 new electric buses as part of its sustainable transport initiative to improve air quality.',
          source: 'Times of India',
          url: 'https://timesofindia.indiatimes.com',
          publishedAt: '2024-10-18T09:15:00Z',
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
          category: 'india'
        },
        {
          title: 'UN Climate Summit 2024: Key Takeaways and Commitments',
          description: 'World leaders gather to discuss climate action, with new pledges to limit global warming to 1.5°C.',
          source: 'Al Jazeera',
          url: 'https://www.aljazeera.com',
          publishedAt: '2024-10-17T16:45:00Z',
          image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
          category: 'global'
        },
        {
          title: 'Delhi Air Quality Improves with New Green Policies',
          description: 'Delhi reports significant improvement in air quality following implementation of strict pollution control measures.',
          source: 'NDTV',
          url: 'https://www.ndtv.com',
          publishedAt: '2024-10-16T11:30:00Z',
          image: 'https://images.unsplash.com/photo-1502028915255-1782e0bf1a2b?w=400',
          category: 'india'
        },
        {
          title: 'Solar Energy Costs Drop to All-Time Low Worldwide',
          description: 'New report shows solar energy is now cheaper than coal in most countries, accelerating renewable adoption.',
          source: 'Reuters',
          url: 'https://www.reuters.com',
          publishedAt: '2024-10-15T08:00:00Z',
          image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
          category: 'global'
        },
        {
          title: 'Bangalore Tech Hub Goes Carbon Neutral',
          description: 'Major tech parks in Bangalore achieve carbon neutrality through renewable energy and offset programs.',
          source: 'Economic Times',
          url: 'https://economictimes.indiatimes.com',
          publishedAt: '2024-10-14T13:20:00Z',
          image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400',
          category: 'india'
        },
        {
          title: 'Scientists Develop New Carbon Capture Technology',
          description: 'Breakthrough technology promises to capture CO₂ from atmosphere at 90% lower cost than current methods.',
          source: 'Nature',
          url: 'https://www.nature.com',
          publishedAt: '2024-10-13T10:10:00Z',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
          category: 'global'
        },
      ];

      // Filter news based on selected category
      const filteredNews = filter === 'all' 
        ? mockNewsData 
        : mockNewsData.filter(item => item.category === filter);

      setNews(filteredNews);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <FiGlobe size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Sustainability News</h1>
              <p className="text-green-50">Stay updated with climate action worldwide</p>
            </div>
          </div>
          <button
            onClick={() => loadNews()}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All News', icon: '🌍' },
          { value: 'india', label: 'India', icon: '🇮🇳' },
          { value: 'global', label: 'Global', icon: '🌏' },
        ].map((tab) => (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === tab.value
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.category === 'india' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {article.category === 'india' ? '🇮🇳 India' : '🌏 Global'}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                  {article.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <FiCalendar size={14} />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm transition-colors"
                  >
                    <span>Read More</span>
                    <FiExternalLink size={14} />
                  </a>
                </div>

                {/* Source */}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Source: {article.source}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && news.length === 0 && (
        <div className="text-center py-20">
          <FiGlobe className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No News Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try refreshing or changing the filter
          </p>
        </div>
      )}

      {/* API Integration Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-700 rounded-xl p-6"
      >
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          📡 Live News Integration
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          To enable live news, add your NewsAPI key in the backend configuration.
          Visit <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">newsapi.org</a> to get your free API key.
        </p>
      </motion.div>
    </div>
  );
};

export default NewsFeed;

