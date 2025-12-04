import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'frontend',
    difficulty: initialData.difficulty || 'beginner',
    deadline: initialData.deadline || '',
    resources: initialData.resources || ['']
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    }
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const addResourceField = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const removeResourceField = (index) => {
    if (formData.resources.length > 1) {
      const newResources = formData.resources.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        resources: newResources
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const cleanedData = {
        ...formData,
        resources: formData.resources.filter(resource => resource.trim() !== '')
      };
      onSave(cleanedData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        label="Название технологии"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Описание"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        margin="normal"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Категория</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="Категория"
        >
          <MenuItem value="frontend">Frontend</MenuItem>
          <MenuItem value="backend">Backend</MenuItem>
          <MenuItem value="database">База данных</MenuItem>
          <MenuItem value="devops">DevOps</MenuItem>
          <MenuItem value="other">Другое</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Сложность</InputLabel>
        <Select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          label="Сложность"
        >
          <MenuItem value="beginner">Начальный</MenuItem>
          <MenuItem value="intermediate">Средний</MenuItem>
          <MenuItem value="advanced">Продвинутый</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        label="Дедлайн"
        name="deadline"
        type="date"
        value={formData.deadline}
        onChange={handleChange}
        error={!!errors.deadline}
        helperText={errors.deadline}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InputLabel>Ресурсы для изучения</InputLabel>
          <IconButton onClick={addResourceField} size="small" sx={{ ml: 1 }}>
            <AddIcon />
          </IconButton>
        </Box>
        
        {formData.resources.map((resource, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              fullWidth
              value={resource}
              onChange={(e) => handleResourceChange(index, e.target.value)}
              placeholder="https://example.com"
              margin="dense"
            />
            {formData.resources.length > 1 && (
              <IconButton 
                onClick={() => removeResourceField(index)} 
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!isFormValid}
        >
          Сохранить
        </Button>
        <Button 
          type="button" 
          variant="outlined" 
          onClick={onCancel}
        >
          Отмена
        </Button>
      </Box>
    </Box>
  );
}

export default TechnologyForm;