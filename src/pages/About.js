import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

function About() {
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

      <Box sx={{ backgroundColor: 'grey.50', p: 4, borderRadius: 2 }}>
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
    </Container>
  );
}

export default About;