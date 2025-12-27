import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

// ✅ FIX 1: Define these OUTSIDE the component to prevent infinite re-renders
const BASE_URL = process.env.REACT_APP_API_URL || "https://fwd-deploy.onrender.com/api";
const API_URL = `${BASE_URL}/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const currentTokenRef = useRef(null);

  // ✅ FIX 2: Wrapped in useCallback to stabilize the function
  const verifyToken = useCallback(async (token, source = 'initial') => {
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
      // Uses the global API_URL defined above
      const { data } = await axios.get(`${API_URL}/me`, config);
      console.log(`✅ [${source}] User authenticated:`, data.email, data.role);
      setUser(data);
      setAuthError(null);
      currentTokenRef.current = token;
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`❌ [${source}] Token verification failed:`, error.response?.status);
      localStorage.removeItem("token");
      setUser(null);
      setAuthError('Session expired. Please login again.');
      currentTokenRef.current = null;
      console.log(`🧹 [${source}] Cleared invalid token`);
      setLoading(false);
      return false;
    }
  }, []); // Empty dependency array is safe because API_URL is a constant outside

  // Initial token check
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      await verifyToken(token, 'initial');
    };

    checkLoggedIn();

    const handleStorageChange = async (e) => {
      if (e.key === 'token') {
        console.log('🔄 [storage-event] Token changed in another tab');
        
        if (e.newValue === null) {
          console.log('🚪 [storage-event] Logged out in another tab');
          setUser(null);
          setAuthError('You have been logged out in another tab.');
          currentTokenRef.current = null;
        } else if (e.newValue !== currentTokenRef.current) {
          console.log('🔄 [storage-event] Different user logged in another tab');
          setAuthError('You have logged in elsewhere. This session has ended.');
          setUser(null);
          currentTokenRef.current = null;
          
          setTimeout(async () => {
            const newToken = localStorage.getItem("token");
            await verifyToken(newToken, 'storage-event');
          }, 1000);
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('👁️ [visibility] Tab became visible - re-verifying token');
        const token = localStorage.getItem("token");
        if (token !== currentTokenRef.current) {
          console.log('⚠️ [visibility] Token mismatch - re-verifying');
          await verifyToken(token, 'visibility');
        }
      }
    };

    const handleWindowFocus = async () => {
      console.log('🎯 [focus] Window gained focus - checking token');
      const token = localStorage.getItem("token");
      if (token !== currentTokenRef.current) {
        console.log('⚠️ [focus] Token mismatch - re-verifying');
        await verifyToken(token, 'focus');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [verifyToken]); // ✅ FIX 3: verifyToken is now safe to include here

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    
    setAuthError(null);
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
    
    setAuthError(null);
    localStorage.setItem("token", data.token);
    currentTokenRef.current = data.token;
    setUser(data);
    
    console.log('✅ Registration successful:', data.email);
    return data;
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem("token");
    currentTokenRef.current = null;
    setUser(null);
    setAuthError(null);
    console.log('✅ Logout complete');
  };

  const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/forgotpassword`, {
      email,
    });
    return response.data;
  };

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
        forgotPassword,
        resetPassword,
        loading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;