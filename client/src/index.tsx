import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChatProvider>
  </React.StrictMode>
);
