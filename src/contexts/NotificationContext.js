// src/contexts/NotificationContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert, IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // Состояние для временных уведомлений (тост)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 6000
  });

  // Состояние для истории уведомлений
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  // Показываем временное уведомление
  const showNotification = useCallback((message, severity = 'info', duration = 6000) => {
    setNotification({
      open: true,
      message,
      severity,
      duration
    });

    // Добавляем в историю
    const newNotification = {
      id: Date.now(),
      message,
      severity,
      date: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Ограничиваем историю
      localStorage.setItem('notificationHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Скрываем временное уведомление
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Открываем меню уведомлений
  const openNotificationMenu = useCallback((event) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  // Закрываем меню уведомлений
  const closeNotificationMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  // Помечаем все уведомления как прочитанные
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notificationHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Удаляем одно уведомление
  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notificationHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Очищаем все уведомления
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('notificationHistory', JSON.stringify([]));
  }, []);

  // Получаем количество непрочитанных уведомлений
  const unreadCount = notifications.filter(n => !n.read).length;

  // Получаем иконку для типа уведомления
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon fontSize="small" color="success" />;
      case 'error': return <ErrorIcon fontSize="small" color="error" />;
      case 'warning': return <WarningIcon fontSize="small" color="warning" />;
      default: return <InfoIcon fontSize="small" color="info" />;
    }
  };

  // Форматируем дату
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Компонент меню уведомлений
  const NotificationMenu = () => (
    <Menu
      anchorEl={menuAnchor}
      open={menuOpen}
      onClose={closeNotificationMenu}
      onClick={markAllAsRead} // Помечаем все как прочитанные при открытии
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 400,
          mt: 1,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Уведомления</Typography>
        {notifications.length > 0 && (
          <Typography 
            variant="body2" 
            color="primary" 
            onClick={clearAllNotifications}
            sx={{ cursor: 'pointer' }}
          >
            Очистить все
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      {notifications.length === 0 ? (
        <MenuItem disabled>
          <Typography color="text.secondary" align="center" sx={{ width: '100%', py: 2 }}>
            Нет уведомлений
          </Typography>
        </MenuItem>
      ) : (
        notifications.slice(0, 10).map((notification) => (
          <MenuItem key={notification.id} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ mr: 2, mt: 0.5 }}>
              {getSeverityIcon(notification.severity)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(notification.date)}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))
      )}
      
      {notifications.length > 10 && (
        <>
          <Divider />
          <MenuItem>
            <Typography variant="body2" color="primary" align="center" sx={{ width: '100%' }}>
              Показать все ({notifications.length})
            </Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <NotificationContext.Provider value={{ 
      showNotification,
      notifications,
      unreadCount,
      openNotificationMenu,
      closeNotificationMenu,
      markAllAsRead,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
      
      {/* Меню уведомлений */}
      <NotificationMenu />
      
      {/* Временные уведомления (тосты) */}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={hideNotification}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};