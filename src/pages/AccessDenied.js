// src/pages/AccessDenied.js
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';

function AccessDenied() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Доступ ограничен
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Для просмотра этого раздела необходимо войти в систему.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Зарегистрируйтесь или войдите, чтобы получить доступ ко всем функциям трекера технологий.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
            >
              Войти в систему
            </Button>
            
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
            >
              Зарегистрироваться
            </Button>
            
            <Button
              component={Link}
              to="/"
              color="inherit"
            >
              Вернуться на главную
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AccessDenied;