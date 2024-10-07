import React, { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import {
  Button,
  TextField,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const RestaurantForm = () => {
  const [restaurant, setRestaurant] = useState("");
  const { socket } = useWebSocket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = () => {
    if (socket && restaurant) {
      socket.emit("suggest-restaurant", restaurant);
      setRestaurant("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "10px" : "30px", // Reduced padding on mobile
        width: isMobile ? "100%" : "400px", // Full width on mobile
        marginTop: isMobile ? "10px" : "20px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            label="Suggest a Restaurant"
            variant="outlined"
            size="medium"
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
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: isMobile ? "10px" : "14px",
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: "#ff5722", // Button color matching the food theme
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#ff1744", // Hover color matching the theme
              },
            }}
          >
            Suggest
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantForm;
