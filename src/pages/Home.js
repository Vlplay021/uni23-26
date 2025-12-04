import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Home() {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        🚀 Трекер изучения технологий
      </Typography>
      
      <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Систематизируйте свое обучение, отслеживайте прогресс и достигайте целей
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CodeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Управление технологиями
              </Typography>
              <Typography color="text.secondary">
                Добавляйте, редактируйте и отслеживайте технологии, которые изучаете
              </Typography>
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
              <Typography color="text.secondary">
                Анализируйте свой прогресс с помощью графиков и отчетов
              </Typography>
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
              <Typography color="text.secondary">
                Устанавливайте дедлайны и планируйте свое обучение
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button
          component={Link}
          to="/technologies"
          variant="contained"
          size="large"
          sx={{ mr: 2 }}
        >
          Начать изучение
        </Button>
        
        <Button
          component={Link}
          to="/about"
          variant="outlined"
          size="large"
        >
          Узнать больше
        </Button>
      </div>
    </Container>
  );
}

export default Home;