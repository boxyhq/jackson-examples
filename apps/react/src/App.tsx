import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './lib/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Protected from './pages/Protected';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} index />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/profile'
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/protected'
          element={
            <RequireAuth>
              <Protected />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
