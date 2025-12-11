// src/pages/BulkEditPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import BulkStatusEditor from '../components/BulkStatusEditor';

function BulkEditPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Массовое редактирование статусов
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Выберите несколько технологий и измените их статус одновременно
        </Typography>
      </Box>
      
      <BulkStatusEditor />
    </Container>
  );
}

export default BulkEditPage;