import { createTheme } from "@mui/material/styles";

const commonSettings = {
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 16,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      "@media (min-width:600px)": { fontSize: "3rem" },
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      "@media (min-width:600px)": { fontSize: "2.5rem" },
    },
    h3: {
      fontSize: "1.8rem",
      "@media (min-width:600px)": { fontSize: "2.2rem" },
    },
    h4: { fontSize: "1.5rem", fontWeight: 600 },
    body1: {
      fontSize: "1rem",
      "@media (min-width:600px)": { fontSize: "1.1rem" },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (min-width:600px)": { fontSize: "0.95rem" },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "px 0px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 10px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: "#8B4513" },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow-x: hidden;
        }
        main {
          padding: 0 !important;
        }
        body {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .custom-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }
      `,
    },
  },
};

const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "light",
    primary: { main: "#8B4513" },
    secondary: { main: "#FFFFFF" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
  },
});

const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "dark",
    primary: { main: "#8B4513" },
    secondary: { main: "#FFFFFF" },
    background: { default: "#303030", paper: "#424242" },
  },
});

export { lightTheme, darkTheme };
