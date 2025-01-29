import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import ManagerDashboard from './components/ManagerDashboard';
import ClientDashboard from './components/ClientDashboard';
import { VideoDetail } from './components/YouTube/VideoDetail';
import { usePersistentAuth } from './components/Auth/PersistentAuth';

function App() {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID!}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />
          <Route path="/client/*" element={<ClientDashboard />} />
          <Route 
            path="/video/:videoId" 
            element={
              <VideoDetail 
                accessToken={localStorage.getItem('youtube_access_token')} 
              />
            } 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;