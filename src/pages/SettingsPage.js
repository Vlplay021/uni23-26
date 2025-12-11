// src/pages/SettingsPage.js
import { useState, useEffect, useRef } from 'react';
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
  FormControl,
  CircularProgress  
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function SettingsPage() {
  const { mode, toggleTheme } = useTheme();
  const { 
    showNotification, 
    clearAllNotifications,
    notifications 
  } = useNotification();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Проверяем тип файла
  if (!file.name.endsWith('.json')) {
    showNotification('Пожалуйста, выберите файл в формате JSON', 'error');
    return;
  }

  setSelectedFile(file);
  setFileName(file.name);

  // Читаем и сразу импортируем файл
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      
      if (!Array.isArray(imported)) {
        throw new Error('Неверный формат данных. Ожидается массив технологий.');
      }

      // Проверяем структуру данных
      const isValid = imported.every(item => 
        item.title && typeof item.title === 'string'
      );

      if (!isValid) {
        throw new Error('Неверная структура данных. Каждая технология должна иметь поле "title".');
      }

      // Обновляем localStorage
      localStorage.setItem('technologies', JSON.stringify(imported));
      setTechnologiesCount(imported.length);
      
      showNotification(`Успешно импортировано ${imported.length} технологий из файла "${file.name}"`, 'success');
      
      // Сбрасываем файл
      setSelectedFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Перезагружаем страницу через 1.5 секунды
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      showNotification(`Ошибка импорта: ${error.message}`, 'error');
      setSelectedFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  reader.onerror = () => {
    showNotification('Ошибка при чтении файла', 'error');
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  reader.readAsText(file);
};

// Добавим функцию для отмены выбора файла
const handleCancelFile = () => {
  setSelectedFile(null);
  setFileName('');
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

// Добавим функцию для drag-and-drop
const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    
    // Создаем искусственное событие для обработчика файла
    const event = {
      target: {
        files: [file]
      }
    };
    handleFileSelect(event);
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
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
    <CardHeader 
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CloudUploadIcon sx={{ mr: 1 }} />
          Импорт из файла
        </Box>
      }
    />
    <CardContent>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: selectedFile ? 'success.main' : 'grey.400',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          backgroundColor: selectedFile ? 'success.light' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
        onClick={() => document.getElementById('file-input').click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id="file-input"
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        {selectedFile ? (
          <>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ Файл выбран
            </Typography>
            <Typography variant="body1" gutterBottom>
              {fileName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Идет импорт данных...
            </Typography>
            <CircularProgress size={24} sx={{ mt: 2 }} />
          </>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Перетащите JSON файл сюда
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              или нажмите для выбора файла
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Поддерживается только формат .json
            </Typography>
          </>
        )}
      </Box>
      
      {selectedFile && (
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleCancelFile}
          sx={{ mt: 2 }}
        >
          Отменить
        </Button>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Требования к файлу:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'text.secondary' }}>
          <li>Формат: JSON</li>
          <li>Структура: массив объектов</li>
          <li>Каждая технология должна содержать поле "title"</li>
          <li>Поддерживаемые поля: title, description, category, status, difficulty, resources</li>
        </ul>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Пример структуры:
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.100', fontFamily: 'monospace', fontSize: '12px', overflow: 'auto' }}>
{`[
  {
    "title": "React",
    "description": "Библиотека для UI",
    "category": "frontend",
    "status": "in-progress"
  },
  {
    "title": "Node.js",
    "description": "Среда выполнения JavaScript",
    "category": "backend"
  }
]`}
        </Paper>
      </Box>
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