// src/components/Auth/Auth.js
import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Box } from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";

const Auth = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box mt={4}>
          {value === 0 && <Login />}
          {value === 1 && <Signup />}
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
