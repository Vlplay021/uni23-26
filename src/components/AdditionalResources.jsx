// src/components/AdditionalResources.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import { useNotification } from '../contexts/NotificationContext';

function AdditionalResources({ technology, onResourcesUpdate }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedResources, setSuggestedResources] = useState([]);
  const { showNotification } = useNotification();

  // Фиктивные API ресурсы для демонстрации
  const mockApiResources = [
    {
      id: 1,
      title: 'Официальная документация React',
      url: 'https://react.dev',
      description: 'Полная документация React от создателей',
      type: 'documentation'
    },
    {
      id: 2,
      title: 'React на русском',
      url: 'https://ru.reactjs.org',
      description: 'Перевод документации React',
      type: 'documentation'
    },
    {
      id: 3,
      title: 'React Crash Course',
      url: 'https://youtube.com/watch?v=xxx',
      description: 'Видеокурс по основам React',
      type: 'video'
    },
    {
      id: 4,
      title: 'React Patterns',
      url: 'https://reactpatterns.com',
      description: 'Популярные паттерны React',
      type: 'article'
    },
    {
      id: 5,
      title: 'React GitHub Repository',
      url: 'https://github.com/facebook/react',
      description: 'Исходный код React',
      type: 'code'
    },
    {
      id: 6,
      title: 'MDN Web Docs - React',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started',
      description: 'Руководство от MDN',
      type: 'tutorial'
    },
    {
      id: 7,
      title: 'React Native',
      url: 'https://reactnative.dev',
      description: 'React для мобильных приложений',
      type: 'framework'
    },
    {
      id: 8,
      title: 'Next.js - React Framework',
      url: 'https://nextjs.org',
      description: 'Фреймворк на основе React',
      type: 'framework'
    },
    {
      id: 9,
      title: 'Redux - State Management',
      url: 'https://redux.js.org',
      description: 'Управление состоянием для React',
      type: 'library'
    },
    {
      id: 10,
      title: 'React Router',
      url: 'https://reactrouter.com',
      description: 'Маршрутизация для React',
      type: 'library'
    }
  ];

  // Фильтруем ресурсы по технологии
  const getSuggestedResources = () => {
    const keyword = technology.title.toLowerCase();
    return mockApiResources.filter(resource => 
      resource.title.toLowerCase().includes(keyword) ||
      resource.description.toLowerCase().includes(keyword) ||
      resource.type.toLowerCase().includes(keyword)
    ).slice(0, 5);
  };

  useEffect(() => {
    setSuggestedResources(getSuggestedResources());
  }, [technology]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchResources = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Имитация API запроса
    setTimeout(() => {
      const filtered = mockApiResources.filter(resource =>
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase()) ||
        resource.type.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setLoading(false);
      
      if (filtered.length === 0) {
        showNotification('Ресурсы не найдены', 'info');
      }
    }, 500);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      searchResources(value);
    } else {
      setSearchResults([]);
    }
  };

  const addResource = (resource) => {
    const currentResources = technology.resources || [];
    
    if (currentResources.includes(resource.url)) {
      showNotification('Этот ресурс уже добавлен', 'warning');
      return;
    }

    const updatedResources = [...currentResources, resource.url];
    
    // Обновляем технологию в localStorage
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === technology.id 
          ? { ...tech, resources: updatedResources }
          : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
    }

    // Вызываем колбэк для обновления UI
    if (onResourcesUpdate) {
      onResourcesUpdate(updatedResources);
    }

    showNotification(`Ресурс "${resource.title}" добавлен`, 'success');
  };

  const removeResource = (index) => {
    const currentResources = [...(technology.resources || [])];
    currentResources.splice(index, 1);
    
    // Обновляем технологию в localStorage
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === technology.id 
          ? { ...tech, resources: currentResources }
          : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
    }

    // Вызываем колбэк для обновления UI
    if (onResourcesUpdate) {
      onResourcesUpdate(currentResources);
    }

    showNotification('Ресурс удален', 'info');
  };

  const getResourceTypeColor = (type) => {
    switch (type) {
      case 'documentation': return 'primary';
      case 'video': return 'error';
      case 'article': return 'success';
      case 'tutorial': return 'warning';
      case 'framework': return 'info';
      case 'library': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Ресурсы для изучения
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              size="small"
            >
              Добавить из API
            </Button>
          </Box>

          {technology.resources && technology.resources.length > 0 ? (
            <List dense>
              {technology.resources.map((resource, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeResource(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {resource}
                      </a>
                    }
                    secondary={`Ресурс ${index + 1}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              Ресурсы еще не добавлены
            </Typography>
          )}

          {suggestedResources.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Рекомендованные ресурсы:
              </Typography>
              <Grid container spacing={1}>
                {suggestedResources.map((resource) => (
                  <Grid item xs={12} key={resource.id}>
                    <Card variant="outlined" sx={{ p: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2">
                            {resource.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.description}
                          </Typography>
                          <Chip
                            label={resource.type}
                            size="small"
                            color={getResourceTypeColor(resource.type)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Button
                          size="small"
                          onClick={() => addResource(resource)}
                        >
                          Добавить
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Диалог поиска ресурсов */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon />
            Поиск ресурсов для "{technology.title}"
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Введите запрос для поиска ресурсов..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {searchResults.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Найдено ресурсов: {searchResults.length}
              </Typography>
              <List>
                {searchResults.map((resource) => (
                  <ListItem
                    key={resource.id}
                    divider
                    secondaryAction={
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          addResource(resource);
                          handleClose();
                        }}
                      >
                        Добавить
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {resource.title}
                          <Chip
                            label={resource.type}
                            size="small"
                            color={getResourceTypeColor(resource.type)}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {resource.description}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {resource.url}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <Alert severity="info">
              По вашему запросу ничего не найдено. Попробуйте изменить запрос.
            </Alert>
          )}

          {!searchQuery && (
            <Alert severity="info">
              Введите запрос для поиска дополнительных ресурсов.
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdditionalResources;