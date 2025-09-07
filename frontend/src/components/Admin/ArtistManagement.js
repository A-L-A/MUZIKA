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

const ArtistManagement = ({ artists = [], onDelete, onUpdate, onRefresh }) => {
  const safeArtists = Array.isArray(artists) ? artists : [];

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
          label={`Total Artists: ${safeArtists.length}`}
          color="secondary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist Name</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeArtists.map((artist) => (
              <TableRow key={artist._id}>
                <TableCell>
                  {artist.user?.name || artist.name || "Unknown Artist"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={artist.genre || "N/A"}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {artist.bio ? (
                    <Box sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" noWrap title={artist.bio}>
                        {artist.bio.length > 50
                          ? `${artist.bio.substring(0, 50)}...`
                          : artist.bio}
                      </Typography>
                    </Box>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={artist.user?.userType || "artist"}
                    color="default"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onUpdate(artist, "artist")}
                    title="Edit Artist">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(artist, "artist")}
                    title="Delete Artist">
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

export default ArtistManagement;
