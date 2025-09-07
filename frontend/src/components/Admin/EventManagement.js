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

const EventManagement = ({ events = [], onDelete, onUpdate, onRefresh }) => {
  const safeEvents = Array.isArray(events) ? events : [];

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
          label={`Total Events: ${safeEvents.length}`}
          color="info"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Music Genre</TableCell>
              <TableCell>Ticket Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {event.title || "Untitled Event"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.eventType || "N/A"}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.musicGenre || "N/A"}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {event.ticketPrice
                    ? `${event.ticketPrice} ${event.currency || ""}`
                    : "Free"}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onUpdate(event, "event")}
                    title="Edit Event">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(event, "event")}
                    title="Delete Event">
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

export default EventManagement;
