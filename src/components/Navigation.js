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
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, user, logout } = useAuth();
  const { 
    showNotification, 
    unreadCount, 
    openNotificationMenu,
    closeNotificationMenu 
  } = useNotification();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    if (isMobile) setDrawerOpen(false);
  };

  const handleProtectedClick = () => {
    if (!isLoggedIn) {
      showNotification('Войдите в систему для доступа к этому разделу', 'warning');
      if (isMobile) setDrawerOpen(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event.key === 'Tab') || (event.key === 'Shift'))
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const desktopNavItems = (
    <>
      <Button 
        color="inherit" 
        component={Link} 
        to="/" 
        sx={{ mx: 1 }}
        startIcon={<HomeIcon />}
      >
        Главная
      </Button>
      
      <Button 
        color="inherit" 
        component={Link} 
        to="/about"
        sx={{ mx: 1 }}
        startIcon={<InfoIcon />}
      >
        О проекте
      </Button>

      {isLoggedIn && (
        <>
          <Button 
            color="inherit" 
            component={Link} 
            to="/search"
            sx={{ mx: 1 }}
            startIcon={<SearchIcon />}
          >
            Поиск
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/settings"
            sx={{ mx: 1 }}
            startIcon={<SettingsIcon />}
          >
            Настройки
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/technologies"
            sx={{ mx: 1 }}
            startIcon={<ScienceIcon />}
          >
            Технологии
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/statistics"
            sx={{ mx: 1 }}
            startIcon={<BarChartIcon />}
          >
            Статистика
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/add-technology"
            sx={{ mx: 1 }}
            startIcon={<AddIcon />}
          >
            Добавить
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/dashboard"
            sx={{ mx: 1 }}
            startIcon={<DashboardIcon />}
          >
            Панель
          </Button>
        </>
      )}
    </>
  );

  const drawerContent = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary">
          🚀 Трекер технологий
        </Typography>
        <ThemeToggle />
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1 }}>
        <ListItem 
          button 
          component={Link} 
          to="/"
          onClick={handleNavClick}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/about"
          onClick={handleNavClick}
        >
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="О проекте" />
        </ListItem>
        
        {isLoggedIn ? (
          <>
            <ListItem 
              button 
              component={Link} 
              to="/search"
              onClick={handleNavClick}
            >
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Поиск" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/settings"
              onClick={handleNavClick}
            >
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/technologies"
              onClick={handleNavClick}
            >
              <ListItemIcon><ScienceIcon /></ListItemIcon>
              <ListItemText primary="Технологии" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/statistics"
              onClick={handleNavClick}
            >
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="Статистика" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/add-technology"
              onClick={handleNavClick}
            >
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Добавить" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/dashboard"
              onClick={handleNavClick}
            >
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Панель" />
            </ListItem>
          </>
        ) : (
          <>
            <Tooltip title="Войдите для доступа к технологиям" arrow>
              <ListItem 
                button 
                component={Link} 
                to="/login"
                onClick={handleProtectedClick}
              >
                <ListItemIcon><LockIcon /></ListItemIcon>
                <ListItemText 
                  primary="Технологии"
                  secondary="Требуется вход"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </Tooltip>
            
            <Tooltip title="Войдите для просмотра статистики" arrow>
              <ListItem 
                button 
                component={Link} 
                to="/login"
                onClick={handleProtectedClick}
              >
                <ListItemIcon><LockIcon /></ListItemIcon>
                <ListItemText 
                  primary="Статистика"
                  secondary="Требуется вход"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </Tooltip>
          </>
        )}
      </List>
      
      <Divider />
      
      {isLoggedIn ? (
        <>
          <List>
            <ListItem>
              <ListItemText 
                primary={user?.name || user?.username}
                secondary={user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          </List>
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            onClick={handleNavClick}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/register"
            startIcon={<AppRegistrationIcon />}
            onClick={handleNavClick}
          >
            Регистрация
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              {isMobile ? '🚀 Трекер' : '🚀 Трекер технологий'}
            </Link>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
            
            {!isMobile && desktopNavItems}
            
            {/* Уведомления (только для авторизованных, скрываем на маленьких экранах если есть меню) */}
            {isLoggedIn && (
              <Tooltip title="Уведомления">
                <IconButton 
                  color="inherit" 
                  sx={{ mx: 1 }}
                  onClick={openNotificationMenu}
                  size={isMobile ? "small" : "medium"}
                >
                  <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    max={99}
                  >
                    <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            
            {isMobile ? (
              <>
                {/* Меню аккаунта на мобильных */}
                {isLoggedIn ? (
                  <IconButton
                    color="inherit"
                    onClick={handleAccountMenu}
                    size="small"
                  >
                    <AccountCircle />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/login"
                      size="small"
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <LoginIcon fontSize="small" />
                    </Button>
                  </Box>
                )}
                
                {/* Кнопка меню на мобильных */}
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={toggleDrawer(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              /* Меню аккаунта на десктопе */
              isLoggedIn && (
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
              )
            )}
            
            {/* Кнопки входа/регистрации на десктопе для гостей */}
            {!isLoggedIn && !isMobile && (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ mx: 1 }}
                  startIcon={<LoginIcon />}
                >
                  Войти
                </Button>
                
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  sx={{ mx: 1 }}
                  variant="outlined"
                  startIcon={<AppRegistrationIcon />}
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Меню аккаунта для мобильных */}
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
      
      {/* Drawer для мобильной навигации */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Navigation;