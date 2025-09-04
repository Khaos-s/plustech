// App.jsx
import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import { AppContext } from "./context/AppContext";

// Route Components
import { PublicRoutes } from "./routes/PublicRoutes";
import { StudentRoutes } from "./routes/StudentRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { LoadingSpinner } from "./components/LoadingSpinner";
// // import { EmailVerification } from './components/EmailVerification';


function App() {
  const { isLoggedIn, userData, getAuthState } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        await getAuthState();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Public Routes - Always available */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Student Routes - Protected */}
        {isLoggedIn && userData && userData.role === 'user' && (
          <Route path="/dashboard/*" element={<StudentRoutes />} />
        )}

        {/* Admin Routes - Protected */}
        {isLoggedIn && userData && userData.role === 'admin' && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}
      </Routes>
    </>
  );
}

export default App;