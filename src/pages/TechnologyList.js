import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function TechnologyList() {
  const { isLoggedIn } = useAuth();
  const { showNotification } = useNotification();
  
  // В функции добавления
  const handleAddClick = () => {
    if (!isLoggedIn) {
      showNotification('Войдите в систему для добавления технологий', 'warning');
    }
  };

  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

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

  return (
    <Container>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        mt: 2
      }}>
        <Typography variant="h4" component="h1">
          Все технологии
        </Typography>
        
        <Button
          component={Link}
          to="/add-technology"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Добавить технологию
        </Button>
      </Box>

      <Grid container spacing={3}>
        {technologies.map(tech => (
          <Grid item xs={12} sm={6} md={4} key={tech.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tech.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {tech.description?.slice(0, 100)}...
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={tech.category}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={getStatusText(tech.status)}
                    color={getStatusColor(tech.status)}
                    size="small"
                  />
                </Box>
                
                <Button
                  component={Link}
                  to={`/technology/${tech.id}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {technologies.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          border: '2px dashed #ddd',
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Технологий пока нет
          </Typography>
          <Typography color="text.secondary" paragraph>
            Начните добавлять технологии, которые хотите изучить
          </Typography>
          <Button
            component={Link}
            to={isLoggedIn ? "/add-technology" : "/login"}
            onClick={handleAddClick}
            variant="contained"
            startIcon={<AddIcon />}
          >
            {isLoggedIn ? 'Добавить технологию' : 'Войти для добавления'}
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default TechnologyList;