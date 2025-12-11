// src/components/SearchTechnologies.jsx
import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CodeIcon from '@mui/icons-material/Code';
import { useNotification } from '../contexts/NotificationContext';

function SearchTechnologies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const { showNotification } = useNotification();
  
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Загружаем технологии из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const searchTechnologies = (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Имитация API запроса с задержкой
    setTimeout(() => {
      const filtered = technologies.filter(tech => 
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase()) ||
        tech.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filtered);
      setLoading(false);
      
      if (filtered.length === 0 && query.trim()) {
        showNotification(`По запросу "${query}" ничего не найдено`, 'info');
      }
    }, 300);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500); // debounce 500ms
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Поиск технологий
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon color="action" />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Введите название, описание или категорию..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: searchTerm && (
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {results.length > 0 ? (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Найдено технологий: {results.length}
          </Typography>
          
          <Paper>
            <List>
              {results.map((tech) => (
                <ListItem
                  key={tech.id}
                  divider
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon>
                    <CodeIcon color="primary" />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {tech.title}
                        </Typography>
                        <Chip
                          label={getStatusText(tech.status)}
                          color={getStatusColor(tech.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {tech.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={tech.category}
                            variant="outlined"
                            size="small"
                          />
                          {tech.difficulty && (
                            <Chip
                              label={
                                tech.difficulty === 'beginner' ? 'Начальный' :
                                tech.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'
                              }
                              size="small"
                            />
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      ) : searchTerm && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Ничего не найдено
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Попробуйте изменить поисковый запрос
          </Typography>
        </Paper>
      )}

      {!searchTerm && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Поиск технологий
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Введите название, описание или категорию для поиска
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {['React', 'Node.js', 'TypeScript', 'Frontend', 'Backend', 'Database'].map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                onClick={() => {
                  setSearchTerm(tag);
                  searchTechnologies(tag);
                }}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default SearchTechnologies;