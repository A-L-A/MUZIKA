import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  Button,
  Typography,
} from "@mui/material";
import { Edit, Delete, Refresh } from "@mui/icons-material";

const EventHostManagement = ({
  eventHosts = [],
  onDelete,
  onUpdate,
  onRefresh,
}) => {
  const safeEventHosts = Array.isArray(eventHosts) ? eventHosts : [];

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
          Refresh
        </Button>
        <Chip
          label={`Total Event Hosts: ${safeEventHosts.length}`}
          color="warning"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Host Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeEventHosts.map((host) => (
              <TableRow key={host._id}>
                <TableCell>
                  {host.user?.name || host.name || "Unknown Host"}
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {host.companyName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      📞 {host.contactInfo?.phone || "No phone"}
                    </Typography>
                    <Typography variant="body2">
                      🌐 {host.contactInfo?.website || "No website"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {host.description ? (
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        title={host.description}>
                        {host.description.length > 30
                          ? `${host.description.substring(0, 30)}...`
                          : host.description}
                      </Typography>
                    </Box>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onUpdate(host, "eventHost")}
                    title="Edit Event Host">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(host, "eventHost")}
                    title="Delete Event Host">
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

export default EventHostManagement;
