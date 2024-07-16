import React from "react";
import { Container } from "@mui/material";
import Hero from "../components/Home/Hero";
import FeatureCards from "../components/Home/FeatureCards";

const Home = () => {
  return (
    <>
      <Hero />
      <Container sx={{ py: 8 }} maxWidth="md">
        <FeatureCards />
      </Container>
    </>
  );
};

export default Home;
