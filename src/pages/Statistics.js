import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';

function Statistics() {
  const [technologies, setTechnologies] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const techs = JSON.parse(saved);
      setTechnologies(techs);
      
      const statusCount = {
        'completed': 0,
        'in-progress': 0,
        'not-started': 0
      };
      
      const categoryCount = {};
      
      techs.forEach(tech => {
        statusCount[tech.status] = (statusCount[tech.status] || 0) + 1;
        categoryCount[tech.category] = (categoryCount[tech.category] || 0) + 1;
      });
      
      setChartData([
        { name: 'Завершено', value: statusCount.completed, color: '#4caf50' },
        { name: 'В процессе', value: statusCount['in-progress'], color: '#ff9800' },
        { name: 'Не начато', value: statusCount['not-started'], color: '#9e9e9e' }
      ]);
    }
  }, []);

  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        📊 Статистика
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {total}
              </Typography>
              <Typography color="text.secondary">
                Всего технологий
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {completed}
              </Typography>
              <Typography color="text.secondary">
                Завершено
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {inProgress}
              </Typography>
              <Typography color="text.secondary">
                В процессе
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {completionPercentage}%
              </Typography>
              <Typography color="text.secondary">
                Общий прогресс
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Распределение по статусам
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart width={300} height={300}>
                  <Pie
                    data={chartData}
                    cx={150}
                    cy={150}
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Прогресс по месяцам
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <BarChart
                  width={400}
                  height={300}
                  data={[
                    { month: 'Янв', completed: 2, inProgress: 3 },
                    { month: 'Фев', completed: 3, inProgress: 4 },
                    { month: 'Мар', completed: 5, inProgress: 2 },
                    { month: 'Апр', completed: 7, inProgress: 3 },
                    { month: 'Май', completed: 10, inProgress: 2 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#4caf50" />
                  <Bar dataKey="inProgress" fill="#ff9800" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Statistics;