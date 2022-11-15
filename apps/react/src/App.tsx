import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import { AuthProvider } from './lib/authProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} index />
        <Route path='home' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
