// src/pages/TechnologyDetail.js
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  ButtonGroup,
  Grid, // Добавляем Grid в импорт
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PendingIcon from '@mui/icons-material/Pending';
import LinkIcon from '@mui/icons-material/Link';

function TechnologyDetail() {
  const { techId } = useParams();
  const [technology, setTechnology] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'in-progress': return <ScheduleIcon color="warning" />;
      default: return <PendingIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  if (!technology) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Технология не найдена
        </Typography>
        <Typography paragraph>
          Технология с ID {techId} не существует.
        </Typography>
        <Button
          component={Link}
          to="/technologies"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          Назад к списку
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/technologies"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Назад к списку
        </Button>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {technology.title}
            </Typography>
            <Chip
              label={technology.category}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              label={technology.status === 'completed' ? 'Завершено' : 
                     technology.status === 'in-progress' ? 'В процессе' : 'Не начато'}
              color={getStatusColor(technology.status)}
              icon={getStatusIcon(technology.status)}
            />
          </Box>
          
          <ButtonGroup variant="contained">
            <Button
              onClick={() => updateStatus('not-started')}
              color={technology.status === 'not-started' ? 'primary' : 'inherit'}
            >
              Не начато
            </Button>
            <Button
              onClick={() => updateStatus('in-progress')}
              color={technology.status === 'in-progress' ? 'warning' : 'inherit'}
            >
              В процессе
            </Button>
            <Button
              onClick={() => updateStatus('completed')}
              color={technology.status === 'completed' ? 'success' : 'inherit'}
            >
              Завершено
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Описание
              </Typography>
              <Typography>
                {technology.description}
              </Typography>
            </CardContent>
          </Card>

          {technology.difficulty && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Сложность
                </Typography>
                <Chip
                  label={
                    technology.difficulty === 'beginner' ? 'Начальный' :
                    technology.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'
                  }
                  color={
                    technology.difficulty === 'beginner' ? 'success' :
                    technology.difficulty === 'intermediate' ? 'warning' : 'error'
                  }
                />
              </CardContent>
            </Card>
          )}

          {technology.deadline && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Дедлайн
                </Typography>
                <Typography>
                  {new Date(technology.deadline).toLocaleDateString('ru-RU')}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {technology.resources && technology.resources.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ресурсы для изучения
                </Typography>
                <List>
                  {technology.resources.map((resource, index) => (
                    <ListItem 
                      key={index}
                      component="a"
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      button
                    >
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Ресурс ${index + 1}`}
                        secondary={resource}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default TechnologyDetail;