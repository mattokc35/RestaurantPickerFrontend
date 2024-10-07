import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useWebSocket } from "../contexts/WebSocketContext";
import { Button, Box, Typography, Stack } from "@mui/material";
import { Wheel } from "react-custom-roulette";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import Confetti from "react-confetti"; // Import Confetti library

type SpinWheelProps = {
  restaurants: string[];
};

const SpinWheel: React.FC<SpinWheelProps> = ({ restaurants }) => {
  const { socket } = useWebSocket();
  const navigate = useNavigate(); // Use React Router's useNavigate for navigation
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // Track confetti display

  // Convert restaurant names to format required by react-custom-roulette
  const data = restaurants.map((restaurant) => ({ option: restaurant }));

  const handleSpin = () => {
    if (socket && restaurants.length > 0 && !spinning) {
      setSpinning(true); 
      socket.emit("spin-wheel");
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for the spin-wheel event from the server
      socket.on("spin-wheel", ({ restaurant, index }) => {
        setSelectedRestaurant(null); // Hide selected restaurant while spinning
        setSpinResult(index); // Store the index of the result
        setMustSpin(true); // Start the spinning animation
        setSpinning(true);
      });

      // Listen for session deletion from the server
      socket.on("session-deleted", () => {
        setTimeout(() => {
          navigate("/"); // Navigate back to the homepage after session deletion
        }, 2000); // Give a small delay to allow user to process the result
      });

      return () => {
        socket.off("spin-wheel");
        socket.off("session-deleted"); // Clean up event listener
      };
    }
  }, [socket, navigate]);

  useEffect(() => {
    if (selectedRestaurant) {
      // Show confetti after the wheel stops and the restaurant is selected
      setShowConfetti(true);
      // Hide confetti and delete session after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        socket?.emit("delete-session"); // Emit event to delete the session
      }, 5000); // Display confetti for 5 seconds
    }
  }, [selectedRestaurant, socket]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ backgroundColor: "#2c2c2c", padding: "20px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)" }}>
      {showConfetti && <Confetti /> /* Render confetti */}
      
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={4}>
        <RestaurantIcon sx={{ color: "#ff9800", fontSize: 50 }} />
        <FastfoodIcon sx={{ color: "#ff5722", fontSize: 50 }} />
        <LocalPizzaIcon sx={{ color: "#ff1744", fontSize: 50 }} />
      </Stack>

      {restaurants.length > 0 && (
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={spinResult ?? 0}
          data={data}
          backgroundColors={["#ff9800", "#ff5722", "#ff1744", "#ffc107"]}
          textColors={["#ffffff"]}
          onStopSpinning={() => {
            setSpinning(false); 
            setMustSpin(false); 
            setSelectedRestaurant(restaurants[spinResult ?? 0]); 
          }}
          outerBorderColor="#333"
          outerBorderWidth={8}
          innerRadius={20}
          radiusLineColor="#fff"
          radiusLineWidth={5}
          fontSize={18}
          perpendicularText={true}
          spinDuration={1.5}
        />
      )}

      {!mustSpin && selectedRestaurant && (
        <>
        <Typography variant="h6" sx={{ color: "#fff", marginTop: "20px", fontWeight: "bold" }}>
          Selected Restaurant: {selectedRestaurant}
        </Typography>
        <Typography variant="h6" sx={{ color: "#fff", marginTop: "20px", fontWeight: "bold" }}>
          Thanks for playing! This room is now closing and you will be redirected back to the home page.
        </Typography>
        </>
      )}

      <Button
        variant="contained"
        onClick={handleSpin}
        sx={{
          marginTop: "20px",
          padding: "12px",
          backgroundColor: "#ff5722",
          color: "#fff",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#ff1744",
          },
          width: "100%",
          maxWidth: "300px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)"
        }}
        disabled={spinning}
      >
        Spin the Wheel
      </Button>
    </Box>
  );
};

export default SpinWheel;
