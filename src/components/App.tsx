// src/components/App.tsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import { SkeletonDashboard } from './ui/SkeletonDashboard';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esto escucha automáticamente si el usuario entra o sale
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SkeletonDashboard />;
  }

  // Si hay usuario mostramos el Dashboard, si no, el Login
  return user ? (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Dashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  ) : <Login />;
}