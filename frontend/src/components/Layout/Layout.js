import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: '100vw',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;