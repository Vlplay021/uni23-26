// src/pages/SettingsPage.js
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Paper,
  Grid,
  Slider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StorageIcon from '@mui/icons-material/Storage';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const { mode, toggleTheme } = useTheme();
  const { 
    showNotification, 
    clearAllNotifications,
    notifications 
  } = useNotification();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: false,
    autoSave: true,
    saveInterval: 5,
    language: 'ru',
    fontSize: 14,
    compactView: false,
    showProgressBar: true,
    enableAnimations: true
  });

  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [technologiesCount, setTechnologiesCount] = useState(0);

  useEffect(() => {
    // Загружаем сохраненные настройки
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Считаем количество технологий
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologiesCount(JSON.parse(saved).length);
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    showNotification(`Настройка "${key}" изменена`, 'success');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    showNotification('Все настройки сохранены', 'success');
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notificationsEnabled: true,
      emailNotifications: false,
      autoSave: true,
      saveInterval: 5,
      language: 'ru',
      fontSize: 14,
      compactView: false,
      showProgressBar: true,
      enableAnimations: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    showNotification('Настройки сброшены к значениям по умолчанию', 'info');
  };

  const handleExportData = () => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const data = JSON.stringify(JSON.parse(saved), null, 2);
      setExportData(data);
      
      // Создаем файл для скачивания
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `technologies_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      showNotification('Данные успешно экспортированы', 'success');
    }
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importData);
      if (!Array.isArray(data)) {
        throw new Error('Неверный формат данных');
      }
      
      localStorage.setItem('technologies', JSON.stringify(data));
      setTechnologiesCount(data.length);
      setImportData('');
      showNotification(`Импортировано ${data.length} технологий`, 'success');
      
      // Перезагружаем страницу для применения изменений
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showNotification(`Ошибка импорта: ${error.message}`, 'error');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('technologies');
      localStorage.removeItem('notificationHistory');
      setTechnologiesCount(0);
      showNotification('Все данные удалены', 'warning');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  const handleLogoutAll = () => {
    logout();
    localStorage.clear();
    showNotification('Вы вышли из всех устройств', 'info');
    navigate('/');
  };

  const getStorageUsage = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      total += key.length + value.length;
    }
    return (total / 1024).toFixed(2); // в килобайтах
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Настройки приложения
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Настройте внешний вид и поведение приложения под свои предпочтения
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Общие настройки */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaletteIcon sx={{ mr: 1 }} />
                  Внешний вид
                </Box>
              }
            />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  }
                  label="Темная тема"
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>
                    Размер шрифта: {settings.fontSize}px
                  </Typography>
                  <Slider
                    value={settings.fontSize}
                    onChange={(e, value) => handleSettingChange('fontSize', value)}
                    min={12}
                    max={20}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.compactView}
                      onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Компактный вид"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showProgressBar}
                      onChange={(e) => handleSettingChange('showProgressBar', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Показывать прогресс-бар"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAnimations}
                      onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Анимации интерфейса"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Уведомления */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  Уведомления
                </Box>
              }
              subheader={`Всего уведомлений: ${notifications.length}`}
            />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationsEnabled}
                      onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Включить уведомления"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      color="primary"
                      disabled={!settings.notificationsEnabled}
                    />
                  }
                  label="Email уведомления"
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                  >
                    Очистить все уведомления
                  </Button>
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Работа с данными */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StorageIcon sx={{ mr: 1 }} />
                  Данные и хранилище
                </Box>
              }
              subheader={`Использовано: ${getStorageUsage()} KB`}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Технологии"
                    secondary={`${technologiesCount} записей`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Уведомления"
                    secondary={`${notifications.length} записей`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Настройки"
                    secondary="Сохранены локально"
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleExportData}
                  startIcon={<SaveIcon />}
                >
                  Экспорт данных
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearAllData}
                  startIcon={<DeleteIcon />}
                >
                  Удалить все данные
                </Button>
              </Box>
              
              {exportData && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Данные готовы для скачивания
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Импорт данных */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Импорт данных" />
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="JSON данные для импорта"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='[{"title": "Название", "description": "Описание", ...}]'
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleImportData}
                  disabled={!importData.trim()}
                >
                  Импортировать
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Пример данных для импорта
                    setImportData(JSON.stringify([
                      {
                        "id": Date.now(),
                        "title": "Пример технологии",
                        "description": "Это пример технологии для импорта",
                        "category": "frontend",
                        "status": "not-started",
                        "difficulty": "beginner",
                        "resources": ["https://example.com"]
                      }
                    ], null, 2));
                  }}
                >
                  Пример данных
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Вставьте JSON массив технологий в формате, аналогичном экспортированным данным
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Дополнительные настройки */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Дополнительные настройки" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Язык интерфейса</InputLabel>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      label="Язык интерфейса"
                    >
                      <MenuItem value="ru">Русский</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Автосохранение</InputLabel>
                    <Select
                      value={settings.saveInterval}
                      onChange={(e) => handleSettingChange('saveInterval', e.target.value)}
                      label="Автосохранение"
                    >
                      <MenuItem value={1}>Каждую минуту</MenuItem>
                      <MenuItem value={5}>Каждые 5 минут</MenuItem>
                      <MenuItem value={15}>Каждые 15 минут</MenuItem>
                      <MenuItem value={0}>Выключено</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSettings}
                    startIcon={<SaveIcon />}
                  >
                    Сохранить все настройки
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleResetSettings}
                    startIcon={<RestartAltIcon />}
                  >
                    Сбросить настройки
                  </Button>
                </Box>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogoutAll}
                >
                  Выйти и очистить все
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Информация о системе */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Информация о системе
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Версия приложения
                </Typography>
                <Typography variant="body1">1.0.0</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Текущая тема
                </Typography>
                <Typography variant="body1">
                  {mode === 'dark' ? 'Темная' : 'Светлая'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Пользователь
                </Typography>
                <Typography variant="body1">
                  {user?.name || 'Гость'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Использовано памяти
                </Typography>
                <Typography variant="body1">
                  {getStorageUsage()} KB
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SettingsPage;