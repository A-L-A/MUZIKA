import { Typography, Container, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const heroImages = [
  { url: "/images/backgroundz/hero-background-1.webp", link: "/" },
  { url: "/images/backgroundz/hero-background-2.webp", link: "/" },
];

// Reusable arrow component
const ArrowButton = ({ onClick, direction }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      [direction === "left" ? "left" : "right"]: "20px",
      zIndex: 1,
      color: "white",
      transform: "translateY(-50%)",
    }}>
    {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    lazyLoad: "ondemand",
  };

  return (
    <>
      <Helmet>
        <link
          rel="preload"
          as="image"
          href={heroImages[0].url}
          type="image/webp"
          imagesrcset={`${heroImages[0].url} 1x`}
        />
      </Helmet>

      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}>
        <Slider {...settings}>
          {heroImages.map((image, index) => (
            <div
              key={index}
              style={{ position: "relative", height: "100vh", width: "100%" }}>
              <Link
                to={image.link}
                style={{ display: "block", height: "100%", width: "100%" }}>
                <img
                  src={image.url}
                  alt={`Hero slide ${index + 1}`}
                  loading="lazy"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.7)",
                    transition: "filter 0.3s ease-in-out",
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                />
              </Link>
            </div>
          ))}
        </Slider>

        {/* Overlay text */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "100%",
            px: 2,
          }}>
          <Container>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "white",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                WebkitTextStroke: "2px black",
              }}>
              Locate & Attend East Africa&apos;s best music events!
            </Typography>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to="/events"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "30px",
                  background: "linear-gradient(90deg, #8B4513, #5C2E0C)",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #A0522D, #3E1E08)",
                    boxShadow: "0px 6px 14px rgba(0,0,0,0.4)",
                  },
                }}>
                Explore Events
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to="/artists"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "30px",
                  color: "white",
                  borderColor: "white",
                  backdropFilter: "blur(2px)",
                  "&:hover": {
                    borderColor: "primary.light",
                    color: "primary.light",
                    backgroundColor: "rgba(0,0,0,0.3)",
                  },
                }}>
                Discover Artists
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Hero;
