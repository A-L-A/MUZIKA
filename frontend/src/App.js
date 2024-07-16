import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Auth from "./components/Auth/Auth";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Events from "./pages/Events";
import setAuthToken from "./utils/setAuthToken";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
