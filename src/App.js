import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import About from './pages/About';
import Statistics from './pages/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import { muiTheme } from './themes/muiTheme';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { technologies, loading, refetch } = useTechnologiesApi();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Navigation 
            isLoggedIn={isLoggedIn} 
            onLogout={handleLogout} 
          />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/technologies" element={<TechnologyList />} />
              <Route path="/technology/:techId" element={<TechnologyDetail />} />
              <Route path="/add-technology" element={<AddTechnology />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route 
                path="/login" 
                element={<Login onLogin={handleLogin} />} 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <DashboardPage technologies={technologies} />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
            </Routes>
          </main>
          
          <footer className="footer">
            <p>© 2024 Трекер технологий. Все права защищены.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;