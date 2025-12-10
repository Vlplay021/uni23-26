// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import About from './pages/About';
import Statistics from './pages/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import useTechnologiesApi from './hooks/useTechnologiesApi';

function App() {
  const { technologies, loading } = useTechnologiesApi();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navigation />
              
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Только для гостей */}
                  <Route 
                    path="/login" 
                    element={
                      <GuestRoute>
                        <Login />
                      </GuestRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <GuestRoute>
                        <Register />
                      </GuestRoute>
                    } 
                  />
                  
                  {/* Только для авторизованных */}
                  <Route 
                    path="/technologies" 
                    element={
                      <ProtectedRoute>
                        <TechnologyList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/technology/:techId" 
                    element={
                      <ProtectedRoute>
                        <TechnologyDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/statistics" 
                    element={
                      <ProtectedRoute>
                        <Statistics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/add-technology" 
                    element={
                      <ProtectedRoute>
                        <AddTechnology />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage technologies={technologies} />
                      </ProtectedRoute>
                    } 
                  />
                
                </Routes>
              </main>
              
              <footer className="footer">
                <p>© 2025 Трекер технологий. Все права защищены.</p>
              </footer>
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;