import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EAST_AFRICAN_COUNTRIES = [
  "Burundi",
  "Democratic Republic of Congo",
  "Kenya",
  "Rwanda",
  "Somalia",
  "South Sudan",
  "Tanzania",
  "Uganda",
];

const Auth = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "regularUser",
    country: "",
    genre: "",
    bio: "",
    companyName: "",
    description: "",
    phone: "",
    website: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        console.log("Auth component: Attempting login");
        const user = await login(formData.email, formData.password);

        if (!user) {
          throw new Error("Login failed - no user data returned");
        }

        if (!user.userType) {
          throw new Error("User data incomplete - missing userType");
        }

        console.log(
          "Auth component: Redirecting based on user type:",
          user.userType
        );
        
        if (user.userType === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        // Signup flow
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
          country: formData.country,
        };

        // Add optional fields
        if (formData.userType === "artist") {
          if (formData.genre) userData.genre = formData.genre;
          if (formData.bio) userData.bio = formData.bio;
        } else if (formData.userType === "eventHost") {
          if (formData.companyName) userData.companyName = formData.companyName;
          if (formData.description) userData.description = formData.description;
          if (formData.phone || formData.website) {
            userData.contactInfo = {};
            if (formData.phone) userData.contactInfo.phone = formData.phone;
            if (formData.website)
              userData.contactInfo.website = formData.website;
          }
        }

        console.log("Auth component: Attempting registration");
        const user = await register(userData);
        console.log("Auth component: Registration successful, user:", user);

        if (!user) {
          throw new Error("Registration failed - no user data returned");
        }

        navigate("/profile");
      }
    } catch (err) {
      console.error("Auth component: Error caught:", err);
      // Show specific error messages
      let errorMessage = "An error occurred during authentication.";

      if (err.message.includes("Invalid response from server")) {
        errorMessage = "Server returned invalid response. Please try again.";
      } else if (err.message.includes("no user data")) {
        errorMessage =
          "Authentication successful but user data missing. Please contact support.";
      } else if (err.message.includes("userType")) {
        errorMessage = "User data incomplete. Please try logging in again.";
      } else {
        errorMessage =
          err.message || "An error occurred during authentication.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box maxWidth="md" margin="auto" padding={3}>
      <Tabs
        value={isLogin ? 0 : 1}
        onChange={(_, newValue) => setIsLogin(newValue === 0)}
        centered
        sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {/* Signup-only fields */}
          {!isLogin && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    label="User Type"
                    disabled={loading}>
                    <MenuItem value="regularUser">Regular User</MenuItem>
                    <MenuItem value="artist">Artist</MenuItem>
                    <MenuItem value="eventHost">Event Host</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    label="Country"
                    disabled={loading}>
                    <MenuItem value="" disabled>
                      Select Country
                    </MenuItem>
                    {EAST_AFRICAN_COUNTRIES.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Artist-specific fields (OPTIONAL) */}
              {formData.userType === "artist" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Music Genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Afrobeat, Hiphop, Reggae"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Tell us about yourself as an artist..."
                    />
                  </Grid>
                </>
              )}

              {/* Event Host-specific fields (OPTIONAL) */}
              {formData.userType === "eventHost" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Your company or organization name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Describe your event hosting services..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Phone number for contact"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="https://your-website.com"
                    />
                  </Grid>
                </>
              )}
            </>
          )}

          {/* Common fields (REQUIRED) */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}>
          {loading
            ? isLogin
              ? "Signing In..."
              : "Creating Account..."
            : isLogin
            ? "Sign In"
            : "Sign Up"}
        </Button>

        <Box textAlign="center">
          <Button
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            sx={{ textTransform: "none" }}>
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
