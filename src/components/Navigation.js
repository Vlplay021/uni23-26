import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Navigation({ isLoggedIn, onLogout }) {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🚀 Трекер технологий
          </Link>
        </Typography>
        
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
        
        <Button 
          color="inherit" 
          component={Link} 
          to="/about"
          sx={{ mx: 1 }}
        >
          О проекте
        </Button>

        {isLoggedIn ? (
          <>
            <IconButton color="inherit" sx={{ mx: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/dashboard"
              sx={{ mx: 1 }}
            >
              Панель управления
            </Button>
            
            <Button 
              color="inherit" 
              onClick={onLogout}
              sx={{ mx: 1 }}
            >
              Выйти
            </Button>
          </>
        ) : (
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
            sx={{ mx: 1 }}
          >
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;