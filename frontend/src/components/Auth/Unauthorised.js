import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Return to Homepage
      </Button>
    </Box>
  );
};

export default Unauthorized;
