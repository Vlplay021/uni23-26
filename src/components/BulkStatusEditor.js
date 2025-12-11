// src/components/BulkStatusEditor.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PendingIcon from '@mui/icons-material/Pending';
import { useNotification } from '../contexts/NotificationContext';

function BulkStatusEditor() {
  const [technologies, setTechnologies] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');
  const { showNotification } = useNotification();

  // Загружаем технологии из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  // Обработчик выбора/снятия выбора технологии
  const handleSelectTech = (techId) => {
    setSelectedTech(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  // Выбрать все технологии
  const handleSelectAll = () => {
    if (selectedTech.length === technologies.length) {
      setSelectedTech([]);
    } else {
      setSelectedTech(technologies.map(tech => tech.id));
    }
  };

  // Массовое обновление статусов
  const handleBulkUpdate = () => {
    if (selectedTech.length === 0) {
      showNotification('Выберите хотя бы одну технологию', 'warning');
      return;
    }

    const updatedTechs = technologies.map(tech => {
      if (selectedTech.includes(tech.id)) {
        return { ...tech, status: newStatus };
      }
      return tech;
    });

    localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    setTechnologies(updatedTechs);
    
    // Сбрасываем выбранные элементы
    setSelectedTech([]);
    
    showNotification(
      `Статус обновлен для ${selectedTech.length} технологий`,
      'success'
    );
  };

  // Получить иконку статуса
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'in-progress': return <ScheduleIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  // Получить цвет статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  // Получить текст статуса
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  // Получить выбранные технологии для отображения
  const getSelectedTechDetails = () => {
    return technologies.filter(tech => selectedTech.includes(tech.id));
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '0 auto', mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Массовое редактирование статусов
        </Typography>
        <Typography color="text.secondary" paragraph>
          Выберите технологии и установите для них новый статус
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Панель управления */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTech.length === technologies.length && technologies.length > 0}
                indeterminate={selectedTech.length > 0 && selectedTech.length < technologies.length}
                onChange={handleSelectAll}
              />
            }
            label="Выбрать все"
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Новый статус</InputLabel>
            <Select
              value={newStatus}
              label="Новый статус"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="not-started">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PendingIcon fontSize="small" />
                  <span>Не начато</span>
                </Box>
              </MenuItem>
              <MenuItem value="in-progress">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon fontSize="small" />
                  <span>В процессе</span>
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" />
                  <span>Завершено</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleBulkUpdate}
            disabled={selectedTech.length === 0}
          >
            Применить к выбранным ({selectedTech.length})
          </Button>
        </Box>

        {/* Информация о выбранных */}
        {selectedTech.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Выбрано технологий: {selectedTech.length}
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getSelectedTechDetails().map(tech => (
                <Chip
                  key={tech.id}
                  label={tech.title}
                  size="small"
                  onDelete={() => handleSelectTech(tech.id)}
                />
              ))}
            </Box>
          </Alert>
        )}

        {/* Список технологий */}
        {technologies.length === 0 ? (
          <Alert severity="info">
            Технологий не найдено. Добавьте технологии для управления статусами.
          </Alert>
        ) : (
          <Paper 
            variant="outlined" 
            sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              p: 2
            }}
          >
            <FormGroup>
              {technologies.map((tech) => (
                <Box 
                  key={tech.id}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTech.includes(tech.id)}
                        onChange={() => handleSelectTech(tech.id)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                          {tech.title}
                        </Typography>
                        <Chip
                          label={getStatusText(tech.status)}
                          color={getStatusColor(tech.status)}
                          size="small"
                          icon={getStatusIcon(tech.status)}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {tech.category}
                        </Typography>
                      </Box>
                    }
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              ))}
            </FormGroup>
          </Paper>
        )}

        {/* Статистика */}
        {technologies.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Статистика:
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Chip
                label={`Всего: ${technologies.length}`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Завершено: ${technologies.filter(t => t.status === 'completed').length}`}
                color="success"
                size="small"
                variant="outlined"
              />
              <Chip
                label={`В процессе: ${technologies.filter(t => t.status === 'in-progress').length}`}
                color="warning"
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Не начато: ${technologies.filter(t => t.status === 'not-started').length}`}
                color="default"
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default BulkStatusEditor;