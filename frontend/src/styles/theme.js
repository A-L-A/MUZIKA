import { createTheme } from "@mui/material/styles";

// Light theme
const lightTheme = createTheme({
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
  typography: {
    fontSize: 16,
    h1: {
      fontSize: "2.5rem",
      "@media (min-width:600px)": {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
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
          fontSize: "1rem",
          "@media (min-width:600px)": {
            fontSize: "1.1rem",
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
});

// Dark theme
const darkTheme = createTheme({
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
  typography: {
    fontSize: 16,
    h1: {
      fontSize: "2.5rem",
      "@media (min-width:600px)": {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
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
          fontSize: "1rem",
          "@media (min-width:600px)": {
            fontSize: "1.1rem",
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
});

export { lightTheme, darkTheme };
