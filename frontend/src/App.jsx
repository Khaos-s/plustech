import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { LandingPage } from "./pages/LandingPage";
import { Navigation } from "./components/Navigation";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { Toaster } from "sonner";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AppContext } from "./context/AppContext";
import { RewardsPage } from "./pages/RewardsPage";

function App() {
  const { isLoggedIn, userData, getAuthState } = useContext(AppContext);
  const navigate = useNavigate();

  // Check authentication status when app loads
  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigation />} >
          <Route index element={<LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />} />
          <Route path="login" element={<Login onBack={() => navigate("/")} onRegister={() => navigate("/register")} />} />
          <Route path="register" element={<Register onBack={() => navigate("/")} onLogin={() => navigate("/login")} />} />
          {/* Protected routes - only show if logged in */}
          {isLoggedIn && (
            <>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="rewards" element={<RewardsPage />} />
              {userData?.role === 'admin' && (
                <Route path="admin" element={<AdminDashboard />} />
              )}
            </>
          )}
        </Route>
      </Routes>
    </>
  );
}

export default App;