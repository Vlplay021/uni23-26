import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import { Button, Alert, CircularProgress, Box } from '@mui/material';

function RoadmapImporter() {
  const { technologies, loading, error, addTechnology } = useTechnologiesApi();
  const [importing, setImporting] = useState(false);

  const handleImportRoadmap = async (roadmapUrl) => {
    try {
      setImporting(true);

      const response = await fetch(roadmapUrl);
      if (!response.ok) throw new Error('Не удалось загрузить дорожную карту');

      const roadmapData = await response.json();

      for (const tech of roadmapData.technologies) {
        await addTechnology(tech);
      }

      alert(`Успешно импортировано ${roadmapData.technologies.length} технологий`);

    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleExampleImport = () => {
    handleImportRoadmap('https://api.example.com/roadmaps/frontend');
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, mb: 3 }}>
      <h3>Импорт дорожной карты</h3>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleExampleImport}
          disabled={importing}
          startIcon={importing ? <CircularProgress size={20} /> : null}
        >
          {importing ? 'Импорт...' : 'Импорт пример дорожной карты'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default RoadmapImporter;