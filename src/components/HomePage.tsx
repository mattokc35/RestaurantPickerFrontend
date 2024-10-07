import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

const HomePage = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleJoinSession = () => {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#242424",
        minHeight: "95vh",
        color: theme.palette.text.primary,
        padding: isMobile ? "20px" : "40px",
        textAlign: "center", 
      }}
    >
      {/* Add food-related icons */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <FastfoodIcon sx={{ color: "#ff9800", fontSize: 50, marginRight: "10px" }} />
        <RestaurantIcon sx={{ color: "#ff5722", fontSize: 50, marginRight: "10px" }} />
        <LocalPizzaIcon sx={{ color: "#ff1744", fontSize: 50 }} />
      </Box>

      <Box
        sx={{
          width: isMobile ? "100%" : "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: isMobile ? "transparent" : "#333",
          borderRadius: isMobile ? "0px" : "12px",
          padding: isMobile ? "10px" : "30px",
          boxShadow: isMobile ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            marginBottom: "20px",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          Join a Restaurant Room!
        </Typography>
        <TextField
          fullWidth
          label="Enter Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          variant="outlined"
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#888",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00bcd4",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#aaa",
            },
          }}
        />
        <Button
          onClick={handleJoinSession}
          variant="contained"
          color="primary"
          sx={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#ff5722", // Button color matching the food theme
          color: "#fff",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#ff1744", // Hover color matching the theme
          }
          }}
        >
          Join Session
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
