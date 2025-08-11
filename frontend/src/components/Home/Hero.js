import { Typography, Container, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const heroImages = [
  {
    url: "/images/backgroundz/hero-background-1.webp",
    link: "/",
  },
  {
    url: "/images/backgroundz/hero-background-2.webp",
    link: "/",
  },
  {
    url: "/images/backgroundz/hero-background-3.webp",
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
      }}
    >
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
      }}
    >
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
          height: "calc(100vh - 64px)",
          width: "100vw",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Slider {...settings}>
          {heroImages.map((image, index) => (
            <div key={index} style={{ position: "relative", height: "calc(100vh - 64px)", width: "100vw" }}>
              <Link to={image.link} style={{ display: "block", height: "100%", width: "100%" }}>
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


        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "100%",
            padding: 0,
            margin: 0,
          }}
        >
          <Container maxWidth="sm" sx={{ padding: 0 }}>
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
                margin: 0,
              }}
            >
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
                }}
              >
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
                    WebkitTextStroke: "2px black",
                  },
                }}
              >
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