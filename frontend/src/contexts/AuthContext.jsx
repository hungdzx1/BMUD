import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({
    configured: false,
    connected: false,
    message: 'Đang kiểm tra kết nối Database...'
  });

  // Kiểm tra trạng thái cơ sở dữ liệu
  const checkDbStatus = useCallback(async () => {
    try {
      const res = await authApi.getDbStatus();
      setDbStatus(res);
      return res;
    } catch (err) {
      setDbStatus({
        configured: false,
        connected: false,
        message: err.message || 'Không thể kết nối đến Backend Server.'
      });
      return null;
    }
  }, []);

  // Kiểm tra phiên đăng nhập khi tải ứng dụng
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      if (res && res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    checkDbStatus();
  }, [checkAuth, checkDbStatus]);

  // Hàm xử lý đăng nhập
  const login = async (mode, username, password) => {
    let response;
    if (mode === 'vulnerable') {
      response = await authApi.loginVulnerable(username, password);
    } else {
      response = await authApi.loginSecure(username, password);
    }

    if (response && response.success && response.user) {
      setUser({
        ...response.user,
        isDemoInjection: response.isDemoInjection || false,
        loginMode: mode
      });
    }

    return response;
  };

  // Hàm xử lý đăng xuất
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        dbStatus,
        checkDbStatus,
        login,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
