// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем наличие токена или флага авторизации в localStorage
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (username, password) => {
    // Проверяем демо-аккаунты
    const demoAccounts = {
      'admin': { id: 1, username: 'admin', role: 'admin', name: 'Администратор' },
      'user': { id: 2, username: 'user', role: 'user', name: 'Пользователь' }
    };

    const passwords = {
      'admin': 'admin123',
      'user': 'user123'
    };

    if (demoAccounts[username] && passwords[username] === password) {
      const userData = demoAccounts[username];
      
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setIsLoggedIn(true);
      setUser(userData);
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Неверные учетные данные' };
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUser(null);
  };

  const register = (userData) => {
    // Фиктивная регистрация
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user'
    };
    
    localStorage.setItem('auth_token', 'user_token_' + Date.now());
    localStorage.setItem('user_data', JSON.stringify(newUser));
    
    setIsLoggedIn(true);
    setUser(newUser);
    
    return { success: true, user: newUser };
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      register,
      hasPermission: (requiredRole) => {
        if (!isLoggedIn) return false;
        if (requiredRole === 'any') return true;
        return user.role === requiredRole;
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};