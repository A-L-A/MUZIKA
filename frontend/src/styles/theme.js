import { createTheme } from "@mui/material/styles";

// Common theme settings
const commonSettings = {
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 19.2, // Increased by 20%
    h1: {
      fontSize: "3rem",
      "@media (min-width:600px)": {
        fontSize: "4.2rem",
      },
    },
    h2: {
      fontSize: "2.4rem",
      "@media (min-width:600px)": {
        fontSize: "3.6rem",
      },
    },
    h3: {
      fontSize: "2.1rem",
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
    },
    body1: {
      fontSize: "1.2rem",
      "@media (min-width:600px)": {
        fontSize: "1.32rem",
      },
    },
    body2: {
      fontSize: "1.05rem",
      "@media (min-width:600px)": {
        fontSize: "1.2rem",
      },
    },
  },
  components: {
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1.2rem",
          "@media (min-width:600px)": {
            fontSize: "1.32rem",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#8B4513",
        },
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

// Light theme
const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "light",
    primary: {
      main: "#8B4513", // Brown
    },
    secondary: {
      main: "#FFFFFF", // White
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },
});

// Dark theme
const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "dark",
    primary: {
      main: "#8B4513", // Brown
    },
    secondary: {
      main: "#FFFFFF", // White
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
});

export { lightTheme, darkTheme };
