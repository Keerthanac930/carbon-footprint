/**
 * Local Storage Service
 * Handles all persistent data storage for calculations, gamification, chat, settings
 * Uses localStorage with JSON serialization
 */

class LocalStorageService {
  // Storage keys
  static KEYS = {
    CALCULATIONS: 'carbon_calculations',
    USER_PROGRESS: 'user_progress',
    CHAT_HISTORY: 'chat_history',
    SETTINGS: 'settings',
    MARKETPLACE_PURCHASES: 'marketplace_purchases',
  };

  // ==================== CALCULATIONS ====================

  /**
   * Save a calculation locally
   * @param {Object} calculation - Calculation object
   */
  saveCalculation(calculation) {
    const calculations = this.getAllCalculations();
    calculations.unshift({
      ...calculation,
      id: calculation.id || Date.now().toString(),
      createdAt: calculation.createdAt || new Date().toISOString(),
    });
    localStorage.setItem(LocalStorageService.KEYS.CALCULATIONS, JSON.stringify(calculations));
  }

  /**
   * Get all calculations sorted by date (newest first)
   * @returns {Array} Array of calculations
   */
  getAllCalculations() {
    const stored = localStorage.getItem(LocalStorageService.KEYS.CALCULATIONS);
    if (!stored) return [];
    try {
      const calculations = JSON.parse(stored);
      return calculations.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.calculation_date || 0);
        const dateB = new Date(b.createdAt || b.calculation_date || 0);
        return dateB - dateA;
      });
    } catch (e) {
      console.error('Error parsing calculations:', e);
      return [];
    }
  }

  /**
   * Get calculation by ID
   * @param {string} id - Calculation ID
   * @returns {Object|null} Calculation or null
   */
  getCalculation(id) {
    const calculations = this.getAllCalculations();
    return calculations.find(calc => calc.id === id) || null;
  }

  /**
   * Delete calculation
   * @param {string} id - Calculation ID
   */
  deleteCalculation(id) {
    const calculations = this.getAllCalculations();
    const filtered = calculations.filter(calc => calc.id !== id);
    localStorage.setItem(LocalStorageService.KEYS.CALCULATIONS, JSON.stringify(filtered));
  }

  /**
   * Clear all calculations
   */
  clearCalculations() {
    localStorage.removeItem(LocalStorageService.KEYS.CALCULATIONS);
  }

  /**
   * Get latest calculation
   * @returns {Object|null} Latest calculation or null
   */
  getLatestCalculation() {
    const calculations = this.getAllCalculations();
    return calculations.length > 0 ? calculations[0] : null;
  }

  /**
   * Get calculations count
   * @returns {number} Number of calculations
   */
  getCalculationsCount() {
    return this.getAllCalculations().length;
  }

  // ==================== USER PROGRESS / GAMIFICATION ====================

  /**
   * Get user progress
   * @returns {Object} User progress object
   */
  getProgress() {
    const stored = localStorage.getItem(LocalStorageService.KEYS.USER_PROGRESS);
    if (!stored) {
      // Return default progress
      return {
        level: 1,
        points: 0,
        totalCalculations: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString(),
        badges: [],
      };
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing progress:', e);
      return {
        level: 1,
        points: 0,
        totalCalculations: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString(),
        badges: [],
      };
    }
  }

  /**
   * Save user progress
   * @param {Object} progress - Progress object
   */
  saveProgress(progress) {
    localStorage.setItem(LocalStorageService.KEYS.USER_PROGRESS, JSON.stringify(progress));
  }

  /**
   * Update progress
   * @param {Object} updates - Partial progress updates
   */
  updateProgress(updates) {
    const current = this.getProgress();
    const updated = {
      ...current,
      ...updates,
    };
    this.saveProgress(updated);
  }

  /**
   * Add badge
   * @param {string} badgeId - Badge ID
   */
  addBadge(badgeId) {
    const progress = this.getProgress();
    if (!progress.badges.includes(badgeId)) {
      progress.badges.push(badgeId);
      this.saveProgress(progress);
    }
  }

  /**
   * Update streak
   */
  updateStreak() {
    const progress = this.getProgress();
    const now = new Date();
    const lastActive = new Date(progress.lastActiveDate);
    
    // Check if last active was yesterday (within 24-48 hours)
    const daysSinceLastActive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    
    let newStreak = progress.currentStreak;
    if (daysSinceLastActive === 1) {
      // Continue streak
      newStreak = progress.currentStreak + 1;
    } else if (daysSinceLastActive > 1) {
      // Reset streak
      newStreak = 1;
    } else if (daysSinceLastActive === 0) {
      // Same day, keep streak
      newStreak = progress.currentStreak;
    }
    
    const newLongestStreak = newStreak > progress.longestStreak 
        ? newStreak 
        : progress.longestStreak;
    
    this.updateProgress({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: now.toISOString(),
    });
  }

  /**
   * Award points for calculation
   */
  awardCalculationPoints() {
    const progress = this.getProgress();
    const newTotal = progress.totalCalculations + 1;
    const newPoints = progress.points + 10; // 10 points per calculation
    const newLevel = Math.floor(newPoints / 100) + 1;

    // Check for badge unlocks
    const newBadges = [...progress.badges];
    if (newTotal === 1 && !newBadges.includes('first_step')) {
      newBadges.push('first_step');
    }
    if (newTotal === 10 && !newBadges.includes('calculator_master')) {
      newBadges.push('calculator_master');
    }
    if (newTotal === 50 && !newBadges.includes('carbon_expert')) {
      newBadges.push('carbon_expert');
    }
    if (progress.currentStreak >= 7 && !newBadges.includes('week_warrior')) {
      newBadges.push('week_warrior');
    }
    if (progress.currentStreak >= 30 && !newBadges.includes('month_champion')) {
      newBadges.push('month_champion');
    }

    this.updateProgress({
      level: newLevel,
      points: newPoints,
      totalCalculations: newTotal,
      badges: newBadges,
    });

    this.updateStreak();
  }

  /**
   * Award points for offset purchase
   * @param {number} offsetAmount - Amount of CO2 offset in tons
   */
  awardOffsetPoints(offsetAmount) {
    const progress = this.getProgress();
    const points = Math.round(offsetAmount * 5); // 5 points per ton offset
    const newPoints = progress.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    this.updateProgress({
      level: newLevel,
      points: newPoints,
    });
  }

  // ==================== CHAT HISTORY ====================

  /**
   * Save chat message
   * @param {string} role - 'user' or 'assistant'
   * @param {string} message - Message text
   */
  saveChatMessage(role, message) {
    const history = this.getChatHistory();
    history.push({
      role,
      message,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(LocalStorageService.KEYS.CHAT_HISTORY, JSON.stringify(history));
  }

  /**
   * Get chat history
   * @returns {Array} Array of chat messages
   */
  getChatHistory() {
    const stored = localStorage.getItem(LocalStorageService.KEYS.CHAT_HISTORY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing chat history:', e);
      return [];
    }
  }

  /**
   * Clear chat history
   */
  clearChatHistory() {
    localStorage.removeItem(LocalStorageService.KEYS.CHAT_HISTORY);
  }

  // ==================== SETTINGS ====================

  /**
   * Save setting
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   */
  saveSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    localStorage.setItem(LocalStorageService.KEYS.SETTINGS, JSON.stringify(settings));
  }

  /**
   * Get setting
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Setting value
   */
  getSetting(key, defaultValue = null) {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  /**
   * Get all settings
   * @returns {Object} Settings object
   */
  getSettings() {
    const stored = localStorage.getItem(LocalStorageService.KEYS.SETTINGS);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing settings:', e);
      return {};
    }
  }

  /**
   * Get dark mode preference
   * @returns {boolean} Dark mode enabled
   */
  getDarkMode() {
    return this.getSetting('dark_mode', false);
  }

  /**
   * Set dark mode preference
   * @param {boolean} enabled - Dark mode enabled
   */
  setDarkMode(enabled) {
    this.saveSetting('dark_mode', enabled);
  }

  // ==================== MARKETPLACE ====================

  /**
   * Save marketplace purchase
   * @param {Object} purchase - Purchase object
   */
  savePurchase(purchase) {
    const purchases = this.getPurchases();
    purchases.push({
      ...purchase,
      purchaseDate: purchase.purchaseDate || new Date().toISOString(),
    });
    localStorage.setItem(LocalStorageService.KEYS.MARKETPLACE_PURCHASES, JSON.stringify(purchases));
  }

  /**
   * Get all purchases
   * @returns {Array} Array of purchases
   */
  getPurchases() {
    const stored = localStorage.getItem(LocalStorageService.KEYS.MARKETPLACE_PURCHASES);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing purchases:', e);
      return [];
    }
  }

  /**
   * Get total offset amount
   * @returns {number} Total offset in tons
   */
  getTotalOffset() {
    const purchases = this.getPurchases();
    return purchases.reduce((sum, purchase) => sum + (purchase.offsetAmount || 0), 0);
  }

  // ==================== UTILITIES ====================

  /**
   * Clear all data (logout)
   */
  clearAll() {
    this.clearCalculations();
    localStorage.removeItem(LocalStorageService.KEYS.USER_PROGRESS);
    localStorage.removeItem(LocalStorageService.KEYS.CHAT_HISTORY);
    localStorage.removeItem(LocalStorageService.KEYS.MARKETPLACE_PURCHASES);
    // Keep settings (dark mode preference)
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage stats
   */
  getStats() {
    return {
      calculations_count: this.getCalculationsCount(),
      progress_exists: !!localStorage.getItem(LocalStorageService.KEYS.USER_PROGRESS),
      chat_messages_count: this.getChatHistory().length,
      purchases_count: this.getPurchases().length,
    };
  }
}

export default new LocalStorageService();

