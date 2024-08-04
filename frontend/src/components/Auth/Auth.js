import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, password });
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await googleLogin(response.access_token);
        if (result.isNewUser) {
          navigate("/complete-signup");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Google login failed:", error);
        setError("Google login failed. Please try again.");
      }
    },
    onError: () => {
      console.error("Google login failed");
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)", // Adjust based on your navbar height
        backgroundColor: (theme) => theme.palette.background.default,
      }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 400,
          width: "100%",
        }}>
        <IconButton color="primary" sx={{ mb: 2 }}>
          <MusicNoteIcon fontSize="large" />
        </IconButton>
        <Typography component="h1" variant="h5" gutterBottom>
          {isLogin ? "Sign in" : "Sign up"} to Muzika
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => handleGoogleLogin()}>
            Sign in with Google
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Auth;
