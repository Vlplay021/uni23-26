// src/pages/TechnologyDetail.js
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PendingIcon from '@mui/icons-material/Pending';
import LinkIcon from '@mui/icons-material/Link';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function TechnologyDetail() {
  const { techId } = useParams();
  const { isLoggedIn } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
    setLoading(false);
  }, [techId]);

  const updateStatus = (newStatus) => {
    if (!isLoggedIn) {
      showNotification('Войдите в систему для изменения статуса', 'warning');
      return;
    }
    
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
      
      const statusText = {
        'completed': 'Завершено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
      }[newStatus];
      
      showNotification(
        `Статус "${technology.title}" изменен на "${statusText}"`,
        newStatus === 'completed' ? 'success' : 'info'
      );
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

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (!technology) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Технология не найдена
        </Alert>
        <Button
          component={Link}
          to="/technologies"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Назад к списку
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button
        component={Link}
        to="/technologies"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Назад к списку
      </Button>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {technology.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={technology.category}
              variant="outlined"
            />
            <Chip
              label={getStatusText(technology.status)}
              color={getStatusColor(technology.status)}
              icon={getStatusIcon(technology.status)}
            />
          </Box>
        </Box>

        {isLoggedIn ? (
          <ButtonGroup variant="contained" size="medium">
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
        ) : (
          <Button 
            component={Link}
            to="/login"
            variant="outlined"
            onClick={() => showNotification('Войдите для изменения статуса', 'info')}
          >
            Войти для изменения статуса
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Описание
              </Typography>
              <Typography color="text.secondary">
                {technology.description || 'Описание отсутствует'}
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {technology.difficulty && (
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
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
              </Grid>
            )}

            {technology.deadline && (
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Дедлайн
                    </Typography>
                    <Typography>
                      {new Date(technology.deadline).toLocaleDateString('ru-RU')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Создано:
                </Typography>
                <Typography variant="body2">
                  {new Date(technology.createdAt).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>

              {technology.createdBy && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Автор:
                  </Typography>
                  <Typography variant="body2">
                    {technology.createdBy}
                  </Typography>
                </Box>
              )}

              {technology.resources && technology.resources.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Ресурсы для изучения
                  </Typography>
                  <List dense>
                    {technology.resources.filter(r => r.trim()).map((resource, index) => (
                      <ListItem 
                        key={index}
                        component="a"
                        href={resource.startsWith('http') ? resource : `https://${resource}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LinkIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Ресурс ${index + 1}`}
                          secondary={resource.length > 50 ? `${resource.substring(0, 50)}...` : resource}
                          secondaryTypographyProps={{ 
                            sx: { 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TechnologyDetail;