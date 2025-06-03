import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/user/UserDashboard';
import ConsultantSearch from './pages/user/ConsultantSearch';
import ConsultantProfile from './pages/user/ConsultantProfile';
import Payment from './pages/user/Payment';
import Consultations from './pages/user/Consultations';
import LeaveReview from './pages/user/LeaveReview';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import MyProfile from './pages/consultant/MyProfile';
import VideoCallWrapper from './components/VideoCallWraper';
import Settings from './pages/Settings';
import Support from './pages/Support';
import CalendarPage from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <Router>
<Routes>
  {/* Публичные */}
  <Route path="/" element={<LandingPage />} />

  {/* Защищённые: user */}
  <Route element={<ProtectedRoute allowedRoles={['User']} />}>
    <Route element={<MainLayout />}>
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/search" element={<ConsultantSearch />} />
      <Route path="/user/consultant/:id" element={<ConsultantProfile />} />
      <Route path="/user/payment" element={<Payment />} />
      <Route path="/user/consultations" element={<Consultations />} />
      <Route path="/user/leave-review" element={<LeaveReview />} />
    </Route>
  </Route>

  {/* Защищённые: consultant */}
  <Route element={<ProtectedRoute allowedRoles={['Specialist']} />}>
    <Route element={<MainLayout />}>
      <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
      <Route path="/consultant/profile" element={<MyProfile />} />
    </Route>
  </Route>

  {/* Общие защищённые */}
  <Route element={<ProtectedRoute allowedRoles={['User', 'Specialist']} />}>
    <Route element={<MainLayout />}>
      <Route path="/settings" element={<Settings />} />
      <Route path="/support" element={<Support />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/video/:id" element={<VideoCallWrapper />} />
    </Route>
  </Route>
</Routes>
    </Router>
  );
};

export default App;
