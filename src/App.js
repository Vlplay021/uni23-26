// src/App.js
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Изменяем BrowserRouter на HashRouter
import AppProvider from './contexts/AppProvider';
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
import SearchTechnologies from './components/SearchTechnologies';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { technologies, loading } = useTechnologiesApi();

  return (
    <AppProvider>
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
              
              <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <SearchTechnologies />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
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
    </AppProvider>
  );
}

export default App;