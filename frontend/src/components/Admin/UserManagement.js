import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { Edit, Delete, Refresh } from "@mui/icons-material";

const UserManagement = ({ users = [], onDelete, onUpdate, onRefresh }) => {
  const safeUsers = Array.isArray(users) ? users : [];

  const handleDeleteClick = (user, type) => {
    if (user.userType === "admin") {
      alert("Admin accounts cannot be deleted for security reasons.");
      return;
    }
    onDelete(user, type);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Button variant="outlined" startIcon={<Refresh />} onClick={onRefresh}>
          Refresh Data
        </Button>
        <Chip
          label={`Total Users: ${safeUsers.length}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={user.userType || "N/A"}
                    color={user.userType === "admin" ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.country || "N/A"}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onUpdate(user, "user")}
                    title="Edit User">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color={user.userType === "admin" ? "default" : "error"}
                    onClick={() => handleDeleteClick(user, "user")}
                    disabled={user.userType === "admin"}
                    title={
                      user.userType === "admin"
                        ? "Admin accounts cannot be deleted"
                        : "Delete User"
                    }
                    sx={{
                      opacity: user.userType === "admin" ? 0.5 : 1,
                      "&:hover": {
                        backgroundColor:
                          user.userType === "admin"
                            ? "transparent"
                            : "error.light",
                      },
                    }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
