import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container } from "@mui/material"; // Added Container import
import ThemeProviderComponent from "./context/themeContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Auth from "./components/Auth/Auth";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Events from "./pages/Events";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/Admin/Dashboard";
import Profile from "./pages/Profile";
import CompleteSignup from "./components/Auth/CompleteSignup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function AppContent() {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            padding: (theme) => theme.spacing(2),
          }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/events" element={<Events />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

function App() {
  console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
  console.log("Current origin:", window.location.origin);

  return (
    <Container maxWidth={false} disableGutters>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <ThemeProviderComponent>
          <CssBaseline />
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProviderComponent>
      </GoogleOAuthProvider>
    </Container>
  );
}

export default App;
