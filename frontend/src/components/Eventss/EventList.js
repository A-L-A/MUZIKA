import React from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";

const EventList = ({ events }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return <Typography>No events to display.</Typography>;
  }

  return (
    <List>
      {events.map((event) => (
        <ListItem key={event._id} alignItems="flex-start">
          <ListItemText
            primary={event.title}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary">
                  {new Date(event.date).toLocaleString()}
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2">
                    Location: {event.address || "Address not available"}
                  </Typography>
                  <Typography variant="body2">
                    {event.eventType || "Event type not specified"}
                  </Typography>
                  <Typography variant="body2">
                    Artist: {event.artist?.name || "Unknown"}
                  </Typography>
                </Box>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default EventList;
