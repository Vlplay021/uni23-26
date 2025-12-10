import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function GuestProtectedRoute({ children, showPreview = true }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn && showPreview) {
    // Показываем превью для гостей
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Доступ ограничен</h2>
        <p>Для просмотра технологий и статистики необходимо войти в систему</p>
        <p>
          <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Войти
          </a>{' '}
          или{' '}
          <a href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Зарегистрироваться
          </a>
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default GuestProtectedRoute;