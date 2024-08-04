import React from "react";
import { Typography, Container, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const heroImages = [
  {
    url: "https://muzika-s2110857.s3.amazonaws.com/hero-images/pexels-curtis-loy-3404897-5196012.jpg",
    link: "/",
  },
  {
    url: "https://muzika-s2110857.s3.amazonaws.com/hero-images/pexels-wendywei-1190297+(1).jpg",
    link: "/",
  },
  {
    url: "https://muzika-s2110857.s3.amazonaws.com/hero-images/pexels-shamanneri-neri-2664115-4518778.jpg",
    link: "/",
  },
];

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: "20px",
        zIndex: 1,
        color: "white",
      }}>
      <ArrowForwardIosIcon />
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: "20px",
        zIndex: 1,
        color: "white",
      }}>
      <ArrowBackIosIcon />
    </IconButton>
  );
};

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      <Slider {...settings}>
        {heroImages.map((image, index) => (
          <div key={index}>
            <Box
              component={Link}
              to={image.link}
              sx={{
                height: "100vh",
                background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${image.url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
        ))}
      </Slider>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}>
            Muzika
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{
              mb: 4,
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}>
            Locate & Attend East Africa's best music events!
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              component={Link}
              to="/events"
              sx={{
                mr: 2,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}>
              Explore Events
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/artists"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "primary.light",
                  color: "primary.light",
                },
              }}>
              Discover Artists
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Hero;
