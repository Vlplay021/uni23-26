// src/pages/About.js
import { Container, Typography, Box, Card, CardContent, Grid, Button } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function About() {
  const { isLoggedIn } = useAuth();

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        О проекте
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
        Трекер изучения технологий — это инструмент для систематизации обучения
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <CodeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center">
                Цель проекта
              </Typography>
              <Typography align="center">
                Помочь разработчикам эффективно планировать и отслеживать изучение новых технологий
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center">
                Возможности
              </Typography>
              <Typography align="center">
                Управление технологиями, статистика прогресса, планирование обучения
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 48, color: 'warning.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center">
                Технологии
              </Typography>
              <Typography align="center">
                React, Material-UI, React Router, LocalStorage API
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ backgroundColor: 'grey.50', p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Функциональность
        </Typography>
        <ul>
          <li>Добавление и редактирование технологий</li>
          <li>Отслеживание прогресса изучения</li>
          <li>Визуализация статистики</li>
          <li>Импорт/экспорт данных</li>
          <li>Адаптивный дизайн</li>
        </ul>
      </Box>

      {/* Информация о доступе */}
      {!isLoggedIn && (
        <Card sx={{ mt: 4, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🔒 Ограниченный доступ
            </Typography>
            <Typography paragraph>
              Полный функционал доступен только зарегистрированным пользователям
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
              >
                Войти в систему
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="inherit"
              >
                Зарегистрироваться
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Демо-аккаунты */}
      {!isLoggedIn && (
        <Box sx={{ mt: 4, p: 3, border: '1px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom align="center">
            🧪 Демо-аккаунты для тестирования
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Администратор:</Typography>
              <Typography variant="body2">
                Логин: <strong>admin</strong><br />
                Пароль: <strong>admin123</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Пользователь:</Typography>
              <Typography variant="body2">
                Логин: <strong>user</strong><br />
                Пароль: <strong>user123</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default About;