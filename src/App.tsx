import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import ManagerDashboard from './components/ManagerDashboard';
import ClientDashboard from './components/ClientDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'manager' | 'client' | null>(null);

  const handleLogin = (type: 'manager' | 'client') => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  if (isLoggedIn) {
    if (userType === 'manager') {
      return <ManagerDashboard />;
    } else if (userType === 'client') {
      return <ClientDashboard />;
    }
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;