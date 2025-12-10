// src/pages/Home.js
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Alert } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function Home() {
  const { isLoggedIn } = useAuth();
  const { showNotification } = useNotification();

  const handleProtectedAction = () => {
    if (!isLoggedIn) {
      showNotification('Войдите в систему для доступа к функциям', 'warning');
    }
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        🚀 Трекер изучения технологий
      </Typography>
      
      <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Систематизируйте свое обучение, отслеживайте прогресс и достигайте целей
      </Typography>
      
      {!isLoggedIn && (
        <Alert severity="info" sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            Для доступа ко всем функциям необходимо войти в систему
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              sx={{ mr: 2 }}
            >
              Войти
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="outlined"
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CodeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Управление технологиями
              </Typography>
              <Typography color="text.secondary" paragraph>
                Добавляйте, редактируйте и отслеживайте технологии, которые изучаете
              </Typography>
              {!isLoggedIn && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    Требуется вход
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Статистика прогресса
              </Typography>
              <Typography color="text.secondary" paragraph>
                Анализируйте свой прогресс с помощью графиков и отчетов
              </Typography>
              {!isLoggedIn && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    Требуется вход
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Планирование обучения
              </Typography>
              <Typography color="text.secondary" paragraph>
                Устанавливайте дедлайны и планируйте свое обучение
              </Typography>
              {!isLoggedIn && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    Требуется вход
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        {isLoggedIn ? (
          <>
            <Button
              component={Link}
              to="/technologies"
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
            >
              Просмотреть технологии
            </Button>
            
            <Button
              component={Link}
              to="/statistics"
              variant="outlined"
              size="large"
              sx={{ mr: 2 }}
            >
              Посмотреть статистику
            </Button>
          </>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
            >
              Войти для начала работы
            </Button>
            
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
            >
              Узнать больше
            </Button>
          </>
        )}
      </div>

      {/* Демонстрация для гостей */}
      {!isLoggedIn && (
        <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            Демо-режим
          </Typography>
          <Typography paragraph align="center">
            Для тестирования системы вы можете использовать демо-аккаунты:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    👨‍💼 Администратор
                  </Typography>
                  <Typography variant="body2">
                    Логин: <strong>admin</strong>
                    <br />
                    Пароль: <strong>admin123</strong>
                    <br />
                    <small>Полный доступ ко всем функциям</small>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    👤 Пользователь
                  </Typography>
                  <Typography variant="body2">
                    Логин: <strong>user</strong>
                    <br />
                    Пароль: <strong>user123</strong>
                    <br />
                    <small>Базовый доступ к функциям</small>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default Home;