import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // Phase 4: Separate error state
  const currentTokenRef = useRef(null); // Track current token

  // Base URL for API
  const API_URL = "https://fwd-deploy.onrender.com/api/auth";

  // Centralized token verification function
  const verifyToken = async (token, source = 'initial') => {
    if (!token) {
      console.log(`ℹ️ [${source}] No token found - guest mode`);
      setUser(null);
      setAuthError(null);
      setLoading(false);
      return false;
    }

    try {
      console.log(`🔐 [${source}] Verifying token...`);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/me`, config);
      console.log(`✅ [${source}] User authenticated:`, data.email, data.role);
      setUser(data);
      setAuthError(null);
      currentTokenRef.current = token;
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`❌ [${source}] Token verification failed:`, error.response?.status);
      // Invalid token - clear everything
      localStorage.removeItem("token");
      setUser(null);
      setAuthError('Session expired. Please login again.');
      currentTokenRef.current = null;
      console.log(`🧹 [${source}] Cleared invalid token`);
      setLoading(false);
      return false;
    }
  };

  // Initial token check
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      await verifyToken(token, 'initial');
    };

    checkLoggedIn();

    // PHASE 1: Storage event listener for cross-tab synchronization
    const handleStorageChange = async (e) => {
      if (e.key === 'token') {
        console.log('🔄 [storage-event] Token changed in another tab');
        
        if (e.newValue === null) {
          // Token was removed - logout
          console.log('🚪 [storage-event] Logged out in another tab');
          setUser(null);
          setAuthError('You have been logged out in another tab.');
          currentTokenRef.current = null;
        } else if (e.newValue !== currentTokenRef.current) {
          // Different token - new login in another tab
          console.log('🔄 [storage-event] Different user logged in another tab');
          setAuthError('You have logged in elsewhere. This session has ended.');
          setUser(null);
          currentTokenRef.current = null;
          
          // Re-verify the new token
          setTimeout(async () => {
            const newToken = localStorage.getItem("token");
            await verifyToken(newToken, 'storage-event');
          }, 1000);
        }
      }
    };

    // PHASE 2: Tab visibility/focus event listeners
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('👁️ [visibility] Tab became visible - re-verifying token');
        const token = localStorage.getItem("token");
        
        // Check if token changed while tab was hidden
        if (token !== currentTokenRef.current) {
          console.log('⚠️ [visibility] Token mismatch - re-verifying');
          await verifyToken(token, 'visibility');
        }
      }
    };

    const handleWindowFocus = async () => {
      console.log('🎯 [focus] Window gained focus - checking token');
      const token = localStorage.getItem("token");
      
      // Check if token changed while window was unfocused
      if (token !== currentTokenRef.current) {
        console.log('⚠️ [focus] Token mismatch - re-verifying');
        await verifyToken(token, 'focus');
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    
    // PHASE 3: Clear any previous session errors
    setAuthError(null);
    
    // Set new token and update state
    localStorage.setItem("token", data.token);
    currentTokenRef.current = data.token;
    setUser(data);
    
    console.log('✅ Login successful:', data.email, data.role);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    
    // PHASE 3: Clear any previous session errors
    setAuthError(null);
    
    // Set new token and update state
    localStorage.setItem("token", data.token);
    currentTokenRef.current = data.token;
    setUser(data);
    
    console.log('✅ Registration successful:', data.email);
    return data;
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    
    // PHASE 5: Clear token (this will trigger storage event in other tabs)
    localStorage.removeItem("token");
    currentTokenRef.current = null;
    setUser(null);
    setAuthError(null);
    
    // Return to home - will be handled by caller with React Router
    console.log('✅ Logout complete');
  };

  // === NEW: Forgot Password ===
  const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/forgotpassword`, {
      email,
    });
    return response.data;
  };

  // === NEW: Reset Password ===
  const resetPassword = async (resetToken, password) => {
    const response = await axios.put(`${API_URL}/resetpassword/${resetToken}`, {
      password,
    });
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword, // Exported
        resetPassword, // Exported
        loading,
        authError, // PHASE 4: Export auth error state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;