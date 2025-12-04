import { useState, useEffect } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const saved = localStorage.getItem('technologies');
      if (saved) {
        setTechnologies(JSON.parse(saved));
      } else {
        const mockTechnologies = [
          {
            id: 1,
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            category: 'frontend',
            status: 'completed',
            difficulty: 'beginner',
            resources: ['https://react.dev', 'https://ru.reactjs.org']
          },
          {
            id: 2,
            title: 'Node.js',
            description: 'Среда выполнения JavaScript на сервере',
            category: 'backend',
            status: 'in-progress',
            difficulty: 'intermediate',
            resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
          },
          {
            id: 3,
            title: 'Typescript',
            description: 'Типизированное надмножество JavaScript',
            category: 'language',
            status: 'not-started',
            difficulty: 'intermediate',
            resources: ['https://www.typescriptlang.org']
          }
        ];
        
        setTechnologies(mockTechnologies);
        localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
      }

    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = async (techData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(),
        ...techData,
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTech]);
      
      const updated = [...technologies, newTech];
      localStorage.setItem('technologies', JSON.stringify(updated));
      
      return newTech;

    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology
  };
}

export default useTechnologiesApi;