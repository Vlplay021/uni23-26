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