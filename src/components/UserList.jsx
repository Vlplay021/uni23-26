import { useState, useEffect } from 'react';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const userData = await response.json();
      setUsers(userData);

    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке пользователей:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRetry = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="user-list loading">
        <div className="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list error">
        <h2>Произошла ошибка</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Список пользователей ({users.length})</h2>

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <p><strong>Город:</strong> {user.address.city}</p>
            <p><strong>Компания:</strong> {user.company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;