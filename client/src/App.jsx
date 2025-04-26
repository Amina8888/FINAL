// import CallSchedule from "./pages/CallSchedule";
// import PrivateRoute from "./PrivateRoute";
// import { useLocation } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// // import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import SpecialistProfile from "./pages/SpecialistProfile";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import PaymentPage from "./pages/PaymentPage";
// import CalendarManager from "./pages/CalendarManager";
// import ChatPage from "./pages/ChatPage";
// import VideoCall from "./pages/VideoCall";
// import EditProfile from "./pages/EditProfile";
// import SpecialistList from "./pages/SpecialistList";
// import RegisterUserForm from "./pages/Account/RegisterUserForm";


// // Backend должен возвращать список:
// // GET /api/client/specialists

// // json
// // Копировать
// // [
// //   {
// //     "id": "guid",
// //     "fullName": "Айгерим",
// //     "category": "Психолог",
// //     "subcategory": "Детская терапия",
// //     "pricePerConsultation": 35,
// //     "isLicenseApproved": true,
// //     "averageRating": 4.8
// //   }
// // ]
// function Layout() {
//   const location = useLocation();
//   const hideLayout = ["/login", "/register"].includes(location.pathname);

//   return (
//     <div className="min-h-screen flex bg-zinc-900 text-white">
//       {!hideLayout && <Sidebar />}
//       <div className="flex-1">
//         {!hideLayout && <Navbar />}
//         <div className="p-4">
//           <Routes>
//             <Route path="/schedule" element={<PrivateRoute><CallSchedule /></PrivateRoute>} />
//             <Route path="/video" element={<PrivateRoute><VideoCall /></PrivateRoute>} />
//             <Route path="/" element={<Layout />} />
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//             <Route path="/payment/:consultationId" element={<PaymentPage />} />
//             <Route path="/calendar" element={<PrivateRoute><CalendarManager /></PrivateRoute>} />
//             <Route path="/chat/:consultationId" element={<ChatPage />} />
//             <Route path="/video/:consultationId" element={<VideoCall />} />
//             <Route path="/profile/edit" element={<EditProfile />} />
//             <Route path="/specialists" element={<PrivateRoute><SpecialistList /></PrivateRoute>} />
//             <Route path="/register" element={<RegisterUserForm />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterUserForm from "./pages/Account/RegisterUserForm";
import Dashboard from "./pages/Dashboard";
import CallSchedule from "./pages/CallSchedule";
import SpecialistProfile from "./pages/SpecialistProfile";
import PaymentPage from "./pages/PaymentPage";
import CalendarManager from "./pages/CalendarManager";
import ChatPage from "./pages/ChatPage";
import VideoCall from "./pages/VideoCall";
import EditProfile from "./pages/EditProfile";
import SpecialistList from "./pages/SpecialistList";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./PrivateRoute";

function MainLayout() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex bg-zinc-900 text-white">
      {!hideLayout && <Sidebar />}
      <div className="flex-1">
        {!hideLayout && <Navbar />}
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUserForm />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute><CallSchedule /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><CalendarManager /></PrivateRoute>} />
            <Route path="/chat/:consultationId" element={<ChatPage />} />
            <Route path="/video" element={<PrivateRoute><VideoCall /></PrivateRoute>} />
            <Route path="/video/:consultationId" element={<VideoCall />} />
            <Route path="/payment/:consultationId" element={<PaymentPage />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/specialists" element={<PrivateRoute><SpecialistList /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

