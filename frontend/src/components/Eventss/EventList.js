import React from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";

const EventList = ({ events }) => {
  return (
    <List>
      {events.map((event) => (
        <ListItem key={event.id} alignItems="flex-start">
          <ListItemText
            primary={event.title}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary">
                  {event.date} - {event.time}
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2">{event.venue.name}</Typography>
                  <Typography variant="body2">{event.genre}</Typography>
                  <Typography variant="body2">
                    Artist: {event.artist}
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
