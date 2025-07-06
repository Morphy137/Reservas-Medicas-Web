/**
 * Componente principal de la aplicación MediReservas
 * Configura el enrutamiento, autenticación y estructura base
 * @version 1.0.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DoctorListPage from './pages/DoctorListPage';
import BookingPage from './pages/BookingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavigationBar';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <NavigationBar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas por autenticación */}
          <Route 
            path="/doctors" 
            element={
              <ProtectedRoute>
                <DoctorListPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas específicas para pacientes y admin */}
          <Route 
            path="/book" 
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book/:doctorId" 
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard para médicos y admin */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Panel administrativo exclusivo */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Manejo de rutas no encontradas */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="text-gray-600">Página no encontrada</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;