import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ShipmentHistory from './pages/ShipmentHistory';

export default function App() {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/farmer' element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path='/transporter' element={<ProtectedRoute roles={['transporter']}><TransporterDashboard /></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path='/shipment/:id' element={<ProtectedRoute><ShipmentHistory /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}