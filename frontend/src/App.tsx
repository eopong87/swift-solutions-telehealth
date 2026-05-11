import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : showRegister ? (
        <Register onLogin={handleLogin} onBackToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;
