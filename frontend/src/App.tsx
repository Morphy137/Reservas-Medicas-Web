import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorListPage from './pages/DoctorListPage';
import BookingPage from './pages/BookingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorListPage />} />
        <Route path="/book/:doctorId" element={<BookingPage />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;