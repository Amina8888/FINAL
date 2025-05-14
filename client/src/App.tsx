import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import SignUpLogin from './pages/SignUpLogin';
import UserDashboard from './pages/user/UserDashboard';
import ConsultantSearch from './pages/user/ConsultantSearch';
import ConsultantProfile from './pages/user/ConsultantProfile';
import RequestConsultation from './pages/user/RequestConsultation';
import Payment from './pages/user/Payment';
import Consultations from './pages/user/Consultations';
import LeaveReview from './pages/user/LeaveReview';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import MyProfile from './pages/consultant/MyProfile';
import ConsultationRequests from './pages/consultant/ConsultationRequests';
import Calendar from './pages/consultant/Calendar';
import ChatVideoCall from './pages/ChatVideoCall';
import Settings from './pages/Settings';
import Support from './pages/Support';

const App: React.FC = () => {
  return (
    <Router>
<Routes>
  {/* Публичные */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/signup" element={<SignUpLogin />} />
  <Route path="/login" element={<SignUpLogin />} />
  <Route path="/chat" element={<ChatVideoCall />} />

  {/* Защищённые: user */}
  <Route element={<ProtectedRoute allowedRoles={['user']} />}>
    <Route element={<MainLayout />}>
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/search" element={<ConsultantSearch />} />
      <Route path="/user/consultant/:id" element={<ConsultantProfile />} />
      <Route path="/user/request-consultation" element={<RequestConsultation />} />
      <Route path="/user/payment" element={<Payment />} />
      <Route path="/user/consultations" element={<Consultations />} />
      <Route path="/user/leave-review" element={<LeaveReview />} />
    </Route>
  </Route>

  {/* Защищённые: consultant */}
  <Route element={<ProtectedRoute allowedRoles={['consultant']} />}>
    <Route element={<MainLayout />}>
      <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
      <Route path="/consultant/profile" element={<MyProfile />} />
      <Route path="/consultant/requests" element={<ConsultationRequests />} />
      <Route path="/consultant/calendar" element={<Calendar />} />
    </Route>
  </Route>

  {/* Общие защищённые */}
  <Route element={<ProtectedRoute allowedRoles={['user', 'consultant']} />}>
    <Route element={<MainLayout />}>
      <Route path="/settings" element={<Settings />} />
      <Route path="/support" element={<Support />} />
    </Route>
  </Route>
</Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

export default App;
