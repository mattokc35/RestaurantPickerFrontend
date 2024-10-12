import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useRoleStore } from "../store/roleStore";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import IcecreamIcon from '@mui/icons-material/Icecream';

const generateRoomId = () => {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
};

const HomePage = () => {
  const [sessionId, setSessionId] = useState("");
  const [clipboardMsg, setClipboardMsg] = useState(""); // Message to show if copied
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const setRole = useRoleStore((state) => state.setRole);
  const { socket } = useWebSocket(); // Access the socket instance
  const [error, setError] = useState<string | null>(null); // Track errors

  // Handle room full error
  useEffect(() => {
    if (socket) {
      socket.on("error", (message: string) => {
        setError(message); // Set error message
        alert(message); // Show alert to the user
        console.error(error);
      });

      return () => {
        socket.off("error"); // Clean up on unmount
      };
    }
  }, [socket]);

  const handleJoinSession = () => {
    if (sessionId && socket) {
      socket.emit("join-session", sessionId);

      socket.on("join-success", () => {
        setRole("guest");
        navigate(`/session/${sessionId}`);
      })

      socket.on("error", (errorMsg: string)=> {
        alert(errorMsg);
      })
    }
  };

  const handleCreateSession = () => {
    const newSessionId = generateRoomId(); // Generate a 4-character room ID
    setRole("host"); // Set role as host
    setSessionId(newSessionId); // Set the session ID

    // Copy to clipboard
    navigator.clipboard.writeText(newSessionId).then(() => {
      setClipboardMsg("Room ID copied to clipboard! Share it with your friends.");
      setTimeout(() => setClipboardMsg(""), 3000); // Clear message after 3 seconds
    });

    // Navigate to session page
    navigate(`/session/${newSessionId}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#fff3e0", // Lighter background for a friendly look
        minHeight: "95vh",
        color: theme.palette.text.primary,
        padding: isMobile ? "20px" : "40px",
        textAlign: "center",
        borderRadius: "12px", // Rounded edges for the entire container
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)", // Add a soft shadow
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
        <RestaurantIcon sx={{ color: "#ff9800", fontSize: 50 }} />
        <FastfoodIcon sx={{ color: "#ff5722", fontSize: 50 }} />
        <IcecreamIcon sx={{ color: "#ffc107", fontSize: 50 }} />
      </Stack>

      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#ff5722", fontWeight: "bold" }}>
        Create or Join a Room
      </Typography>

      {clipboardMsg && (
        <Typography variant="body2" sx={{ marginBottom: "10px", color: "#4caf50" }}>
          {clipboardMsg}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleCreateSession}
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#ff5722", // Bright button color
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#ff1744" },
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        Create a Room
      </Button>

      <TextField
        fullWidth
        label="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        variant="outlined"
        sx={{
          input: { color: "#333" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#888" },
            "&:hover fieldset": { borderColor: "#ff9800" },
            "&.Mui-focused fieldset": { borderColor: "#ff5722" },
          },
          "& .MuiInputLabel-root": { color: "#888" },
          maxWidth: "400px",
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
          backgroundColor: "#ff5722", // Button matches the theme
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#ff1744" },
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        Join Room
      </Button>
    </Box>
  );
};

export default HomePage;
