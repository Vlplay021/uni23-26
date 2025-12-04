import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

function WorkingAccessibleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }
    
    if (!email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Введите корректный email адрес';
    }
    
    if (!message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setName('');
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <h1>Контактная форма</h1>
      
      {/* Область для скринридера */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {isSubmitting && 'Отправка формы...'}
        {submitSuccess && 'Форма успешно отправлена!'}
      </Box>
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Спасибо! Ваше сообщение успешно отправлено.
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        
        <TextField
          fullWidth
          label="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={!!errors.message}
          helperText={errors.message}
          margin="normal"
          multiline
          rows={4}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Отправка...
            </Box>
          ) : 'Отправить'}
        </Button>
      </Box>
    </Box>
  );
}

export default WorkingAccessibleForm;