import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

function DataImportExport() {
  const [technologies, setTechnologies] = useState([]);
  const [status, setStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileImportStatus, setFileImportStatus] = useState('');
const [isFileProcessing, setIsFileProcessing] = useState(false);
const fileInputRef = useRef(null);

// Улучшим функцию импорта из файла
const handleFileImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Проверяем тип файла
  if (!file.name.endsWith('.json')) {
    setStatus('Ошибка: выберите файл в формате JSON');
    setTimeout(() => setStatus(''), 3000);
    return;
  }

  setIsFileProcessing(true);
  setFileImportStatus(`Обработка файла: ${file.name}`);

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      // Более подробная проверка данных
      if (!Array.isArray(imported)) {
        throw new Error('Неверный формат данных. Ожидается массив технологий.');
      }

      // Проверяем минимальные требования
      const validTechnologies = imported.filter(tech => {
        return tech && typeof tech === 'object' && tech.title && typeof tech.title === 'string';
      });

      if (validTechnologies.length === 0) {
        throw new Error('В файле нет валидных технологий. Каждая технология должна иметь поле "title".');
      }

      // Обогащаем данные (добавляем недостающие поля)
      const enrichedTechnologies = validTechnologies.map((tech, index) => ({
        id: tech.id || Date.now() + index,
        title: tech.title,
        description: tech.description || '',
        category: tech.category || 'other',
        status: tech.status || 'not-started',
        difficulty: tech.difficulty || 'beginner',
        resources: tech.resources || [],
        createdAt: tech.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Сливаем с существующими технологиями (уникальность по id)
      const existingTechnologies = [...technologies];
      const newIds = new Set(existingTechnologies.map(t => t.id));
      const uniqueNewTechnologies = enrichedTechnologies.filter(tech => !newIds.has(tech.id));
      
      const mergedTechnologies = [...existingTechnologies, ...uniqueNewTechnologies];
      setTechnologies(mergedTechnologies);
      
      setStatus(`Импортировано ${uniqueNewTechnologies.length} новых технологий из файла`);
      setFileImportStatus(`Успешно обработан файл: ${file.name}`);
      
      // Сохраняем в localStorage
      localStorage.setItem('technologies', JSON.stringify(mergedTechnologies));
      
      // Показываем подробное уведомление
      if (validTechnologies.length > enrichedTechnologies.length) {
        setStatus(`Импортировано ${enrichedTechnologies.length} технологий. ${validTechnologies.length - enrichedTechnologies.length} пропущено из-за дубликатов.`);
      }

    } catch (error) {
      setStatus(`Ошибка импорта: ${error.message}`);
      setFileImportStatus(`Ошибка обработки файла`);
    } finally {
      setIsFileProcessing(false);
      setTimeout(() => {
        setStatus('');
        setFileImportStatus('');
      }, 5000);
      
      // Сбрасываем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  reader.onerror = () => {
    setStatus('Ошибка при чтении файла');
    setIsFileProcessing(false);
    setFileImportStatus('Ошибка чтения файла');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  reader.readAsText(file);
};

// Добавим функцию для создания примера JSON файла
const downloadExampleFile = () => {
  const exampleData = [
    {
      id: 1,
      title: "React",
      description: "Библиотека для создания пользовательских интерфейсов",
      category: "frontend",
      status: "in-progress",
      difficulty: "beginner",
      resources: ["https://react.dev", "https://ru.reactjs.org"],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Node.js",
      description: "Среда выполнения JavaScript на сервере",
      category: "backend",
      status: "not-started",
      difficulty: "intermediate",
      resources: ["https://nodejs.org"],
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "TypeScript",
      description: "Типизированное надмножество JavaScript",
      category: "language",
      status: "completed",
      difficulty: "intermediate",
      resources: ["https://www.typescriptlang.org"],
      createdAt: new Date().toISOString()
    }
  ];

  const dataStr = JSON.stringify(exampleData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'example_technologies.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  setStatus('Пример файла скачан');
  setTimeout(() => setStatus(''), 3000);
};


  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTechnologies(parsed);
        setStatus('Данные загружены из localStorage');
      }
    } catch (error) {
      setStatus('Ошибка загрузки данных из localStorage');
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('technologies', JSON.stringify(technologies));
      setStatus('Данные сохранены в localStorage');
    } catch (error) {
      setStatus('Ошибка сохранения данных');
    }
  };

  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify(technologies, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus('Данные экспортированы в JSON');
    } catch (error) {
      setStatus('Ошибка экспорта данных');
    }
  };

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        if (!Array.isArray(imported)) {
          throw new Error('Неверный формат данных');
        }

        setTechnologies(imported);
        setStatus(`Импортировано ${imported.length} технологий`);
      } catch (error) {
        setStatus('Ошибка импорта: неверный формат файла');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            setTechnologies(imported);
            setStatus(`Импортировано ${imported.length} технологий`);
          }
        } catch (error) {
          setStatus('Ошибка импорта: неверный формат файла');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Импорт и экспорт данных
      </Typography>
      
      {status && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {status}
        </Alert>
      )}
      // В DataImportExport.jsx обновим секцию управления:

{/* Добавим кнопку для скачивания примера */}
<Button
  variant="outlined"
  onClick={downloadExampleFile}
  startIcon={<DownloadIcon />}
>
  Скачать пример файла
</Button>

{/* Обновим input для импорта из файла */}
<label className="file-input-label">
  <input
    type="file"
    accept=".json"
    onChange={handleFileImport}
    ref={fileInputRef}
    style={{ display: 'none' }}
    disabled={isFileProcessing}
  />
  <Button
    variant="contained"
    component="span"
    disabled={isFileProcessing}
    startIcon={isFileProcessing ? <CircularProgress size={20} /> : <CloudUploadIcon />}
  >
    {isFileProcessing ? 'Импорт...' : 'Импорт из файла'}
  </Button>
</label>

{/* Добавим статус обработки файла */}
{fileImportStatus && (
  <Alert severity="info" sx={{ mt: 2 }}>
    <Typography variant="body2">{fileImportStatus}</Typography>
    {isFileProcessing && (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="caption">Обработка файла...</Typography>
      </Box>
    )}
  </Alert>
)}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={exportToJSON}
          disabled={technologies.length === 0}
          startIcon={<DownloadIcon />}
        >
          Экспорт в JSON
        </Button>
        
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Импорт из JSON
          <input
            type="file"
            accept=".json"
            onChange={importFromJSON}
            hidden
          />
        </Button>
        
        <Button
          variant="contained"
          onClick={saveToLocalStorage}
          disabled={technologies.length === 0}
          startIcon={<SaveIcon />}
        >
          Сохранить в localStorage
        </Button>
        
        <Button
          variant="outlined"
          onClick={loadFromLocalStorage}
          startIcon={<FolderOpenIcon />}
        >
          Загрузить из localStorage
        </Button>
      </Box>
      
      <Paper
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          textAlign: 'center',
          mb: 3
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Перетащите JSON-файл сюда
        </Typography>
        <Typography color="text.secondary">
          или используйте кнопку "Импорт из JSON"
        </Typography>
      </Paper>
      
      {technologies.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Импортированные технологии ({technologies.length})
            </Typography>
            <List>
              {technologies.slice(0, 10).map((tech, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={tech.title}
                    secondary={tech.category}
                  />
                </ListItem>
              ))}
              {technologies.length > 10 && (
                <ListItem>
                  <Typography color="text.secondary">
                    ... и еще {technologies.length - 10} технологий
                  </Typography>
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default DataImportExport;