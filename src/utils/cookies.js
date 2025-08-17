// Cookie utility functions for HarGhar Munga Project
// छत्तीसगढ़ शासन - HarGhar Munga Portal Cookie Management

/**
 * Set a cookie with name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration days (default 30 days)
 */
export const setCookie = (name, value, days = 30) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    console.log(`Cookie set: ${name} for ${days} days`);
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name to delete
 */
export const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    console.log(`Cookie deleted: ${name}`);
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

/**
 * Check if cookies are enabled in browser
 * @returns {boolean} - True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    const testKey = 'hgm_cookie_test';
    setCookie(testKey, 'test', 1);
    const isEnabled = getCookie(testKey) === 'test';
    if (isEnabled) {
      deleteCookie(testKey);
    }
    return isEnabled;
  } catch (error) {
    console.error('Error checking cookie support:', error);
    return false;
  }
};

/**
 * Save login credentials to cookies (for remember me functionality)
 * @param {string} username - Username to remember
 * @param {boolean} rememberMe - Whether to save credentials
 */
export const saveLoginCredentials = (username, rememberMe) => {
  try {
    if (rememberMe) {
      setCookie('hgm_remember_user', username, 30); // Remember for 30 days
      setCookie('hgm_remember_me', 'true', 30);
      console.log('Login credentials saved to cookies');
    } else {
      deleteCookie('hgm_remember_user');
      deleteCookie('hgm_remember_me');
      console.log('Login credentials removed from cookies');
    }
  } catch (error) {
    console.error('Error saving login credentials:', error);
  }
};

/**
 * Get saved login credentials from cookies
 * @returns {object} - Object with username and rememberMe status
 */
export const getSavedLoginCredentials = () => {
  try {
    const savedUsername = getCookie('hgm_remember_user');
    const rememberMe = getCookie('hgm_remember_me') === 'true';
    
    return {
      username: savedUsername || '',
      rememberMe: rememberMe && savedUsername !== null
    };
  } catch (error) {
    console.error('Error getting saved login credentials:', error);
    return {
      username: '',
      rememberMe: false
    };
  }
};

/**
 * Save user session data to cookies
 * @param {object} userData - User data to save
 * @param {boolean} persistent - Whether to make session persistent
 */
export const saveUserSession = (userData, persistent = false) => {
  try {
    const sessionData = {
      ...userData,
      loginTime: new Date().toISOString(),
      sessionId: `hgm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const days = persistent ? 7 : 1; // 7 days if persistent, 1 day otherwise
    setCookie('hgm_user_session', JSON.stringify(sessionData), days);
    setCookie('hgm_session_active', 'true', days);
    
    console.log('User session saved to cookies');
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

/**
 * Get user session data from cookies
 * @returns {object|null} - User session data or null
 */
export const getUserSession = () => {
  try {
    const sessionActive = getCookie('hgm_session_active');
    if (sessionActive !== 'true') {
      return null;
    }
    
    const sessionData = getCookie('hgm_user_session');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

/**
 * Clear user session from cookies
 */
export const clearUserSession = () => {
  try {
    deleteCookie('hgm_user_session');
    deleteCookie('hgm_session_active');
    console.log('User session cleared from cookies');
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Save user preferences to cookies
 * @param {object} preferences - User preferences object
 */
export const saveUserPreferences = (preferences) => {
  try {
    setCookie('hgm_user_preferences', JSON.stringify(preferences), 365); // Save for 1 year
    console.log('User preferences saved to cookies');
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

/**
 * Get user preferences from cookies
 * @returns {object} - User preferences object
 */
export const getUserPreferences = () => {
  try {
    const preferences = getCookie('hgm_user_preferences');
    if (preferences) {
      return JSON.parse(preferences);
    }
    return {
      theme: 'light',
      language: 'hi',
      notifications: true,
      autoSave: true
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      theme: 'light',
      language: 'hi',
      notifications: true,
      autoSave: true
    };
  }
};

export default {
  setCookie,
  getCookie,
  deleteCookie,
  areCookiesEnabled,
  saveLoginCredentials,
  getSavedLoginCredentials,
  saveUserSession,
  getUserSession,
  clearUserSession,
  saveUserPreferences,
  getUserPreferences
};
