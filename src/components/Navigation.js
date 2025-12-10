// src/components/Navigation.js
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Box,
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const { 
    showNotification, 
    unreadCount, 
    openNotificationMenu,
    closeNotificationMenu 
  } = useNotification();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(anchorEl);

  const handleAccountMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    showNotification('Вы успешно вышли из системы', 'success');
    handleAccountMenuClose();
  };

  const handleProtectedClick = () => {
    if (!isLoggedIn) {
      showNotification('Войдите в систему для доступа к этому разделу', 'warning');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🚀 Трекер технологий
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Переключатель темы */}
          <ThemeToggle />
          
          {/* Общие ссылки */}
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            sx={{ mx: 1 }}
          >
            Главная
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/about"
            sx={{ mx: 1 }}
          >
            О проекте
          </Button>

          {/* Ссылки доступные только авторизованным */}
          {isLoggedIn ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/technologies"
                sx={{ mx: 1 }}
              >
                Технологии
              </Button>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/statistics"
                sx={{ mx: 1 }}
              >
                Статистика
              </Button>
              
              {/* Кнопка уведомлений */}
              <Tooltip title="Уведомления">
                <IconButton 
                  color="inherit" 
                  sx={{ mx: 1 }}
                  onClick={openNotificationMenu}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/add-technology"
                sx={{ mx: 1 }}
              >
                Добавить
              </Button>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                sx={{ mx: 1 }}
              >
                Панель
              </Button>
              
              {/* Меню аккаунта */}
              <Tooltip title="Аккаунт">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleAccountMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={accountMenuOpen}
                onClose={handleAccountMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user?.name || user?.username}
                    <br />
                    <small>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</small>
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} to="/notifications" onClick={handleAccountMenuClose}>
                  Уведомления ({unreadCount})
                </MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Для гостей - кнопки с тултипами */}
              <Tooltip title="Войдите для доступа к технологиям" arrow>
                <span>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    onClick={handleProtectedClick}
                    sx={{ mx: 1 }}
                  >
                    <LockIcon sx={{ mr: 1, fontSize: 16 }} />
                    Технологии
                  </Button>
                </span>
              </Tooltip>
              
              <Tooltip title="Войдите для просмотра статистики" arrow>
                <span>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    onClick={handleProtectedClick}
                    sx={{ mx: 1 }}
                  >
                    <LockIcon sx={{ mr: 1, fontSize: 16 }} />
                    Статистика
                  </Button>
                </span>
              </Tooltip>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ mx: 1 }}
              >
                Войти
              </Button>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ mx: 1 }}
                variant="outlined"
              >
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;