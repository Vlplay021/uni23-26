// src/pages/AddTechnology.js
import { useNavigate } from 'react-router-dom';
import TechnologyForm from '../components/TechnologyForm';
import { useNotification } from '../contexts/NotificationContext';

function AddTechnology() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSave = (technologyData) => {
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    const newTech = {
      ...technologyData,
      id: Date.now(),
      status: 'not-started',
      createdAt: new Date().toISOString()
    };
    
    technologies.push(newTech);
    localStorage.setItem('technologies', JSON.stringify(technologies));
    
    showNotification(`Технология "${newTech.title}" успешно добавлена!`, 'success');
    navigate('/technologies');
  };

  const handleCancel = () => {
    navigate('/technologies');
    showNotification('Добавление отменено', 'info');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1>Добавить новую технологию</h1>
      <TechnologyForm 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddTechnology;