// import React from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';

// interface MainLayoutProps {
//   children: React.ReactNode;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow">
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

import React from "react";
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from "react-router-dom";
import ChatLauncher from "@/components/chat/ChatLauncher";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatLauncher />
      <Footer />
    </div>
  );
};

export default MainLayout;
