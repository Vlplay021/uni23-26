// src/contexts/AppProvider.js
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
import { AuthProvider } from './AuthContext';

function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default AppProvider;