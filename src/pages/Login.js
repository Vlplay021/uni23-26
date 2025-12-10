// src/pages/Login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123',
    remember: true
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = login(formData.username, formData.password);
      
      if (result.success) {
        showNotification('Вход успешен!', 'success');
        navigate('/dashboard');
      } else {
        showNotification(result.error || 'Неверные учетные данные', 'error');
      }
    } catch (error) {
      showNotification('Ошибка при входе', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'user', password: 'user123' }
    };
    
    setFormData(demoCredentials[role]);
    showNotification(`Демо-аккаунт "${role}" загружен`, 'info');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LockIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h4">
              Вход в систему
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => handleDemoLogin('admin')}
            >
              Демо: Админ
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => handleDemoLogin('user')}
            >
              Демо: Пользователь
            </Button>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя пользователя"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={loading}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.remember}
                  onChange={(e) => setFormData(prev => ({ ...prev, remember: e.target.checked }))}
                  color="primary"
                />
              }
              label="Запомнить меня"
              sx={{ mt: 1 }}
            />

            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              Для теста используйте:
              <br />
              • Админ: admin / admin123
              <br />
              • Пользователь: user / user123
            </Alert>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;