import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const features = [
  {
    title: "Discover Artists",
    description: "Explore a diverse range of talented East African musicians.",
  },
  {
    title: "Upcoming Events",
    description: "Find and attend exciting music events in your area.",
  },
];

const FeatureCards = () => {
  return (
    <Grid container spacing={4}>
      {features.map((feature, index) => (
        <Grid item key={index} xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureCards;
