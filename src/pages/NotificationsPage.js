// src/pages/NotificationsPage.js
import { Container, Typography, Box, Card, CardContent, IconButton, List, ListItem, ListItemAvatar, ListItemText, Divider, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
// import { ProtectedRoute } from '../components/ProtectedRoute';
import ProtectedRoute from '../components/ProtectedRoute';

function NotificationsPage() {
  const { notifications, removeNotification, clearAllNotifications, markAllAsRead } = useNotification();
  const { isLoggedIn } = useAuth();

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (!isLoggedIn) {
    return (
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Для просмотра уведомлений необходимо войти в систему
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        mt: 2
      }}>
        <Typography variant="h4" component="h1">
          <NotificationsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Уведомления
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {notifications.length > 0 && (
            <>
              <Button 
                variant="outlined" 
                onClick={handleMarkAllAsRead}
              >
                Отметить все как прочитанные
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={clearAllNotifications}
              >
                Очистить все
              </Button>
            </>
          )}
        </Box>
      </Box>

      {notifications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              У вас нет уведомлений
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Новые уведомления появятся здесь при добавлении технологий и других событиях
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover'
                  }}
                >
                  <ListItemAvatar>
                    {getSeverityIcon(notification.severity)}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.date)}
                      </Typography>
                    }
                  />
                </ListItem>
              </div>
            ))}
          </List>
        </Card>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Всего уведомлений: {notifications.length}
        </Typography>
      </Box>
    </Container>
  );
}

// Обертка с ProtectedRoute для использования в роутах
export default function ProtectedNotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}