/**
 * Error Handler Utility
 * Centralized error handling and user feedback
 */

export class ErrorHandler {
  /**
   * Show error toast/notification
   * @param {string} message - Error message
   * @param {Object} options - Options for display
   */
  static showError(message, options = {}) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in';
    toast.innerHTML = `
      <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="font-medium">${message}</span>
      <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  /**
   * Show success toast
   * @param {string} message - Success message
   */
  static showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in';
    toast.innerHTML = `
      <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="font-medium">${message}</span>
      <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   */
  static showInfo(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in';
    toast.innerHTML = `
      <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="font-medium">${message}</span>
      <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }

  /**
   * Parse HTTP error to user-friendly message
   * @param {Response} response - HTTP response
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static parseHttpError(response, error) {
    if (response) {
      switch (response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication failed. Please login again.';
        case 403:
          return 'You don\'t have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `An error occurred (${response.status}). Please try again.`;
      }
    }

    // Network errors
    const errorString = error.toString().toLowerCase();
    if (errorString.includes('network') || errorString.includes('connection') || errorString.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }

    if (errorString.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    return 'An unexpected error occurred. Please try again.';
  }
}

