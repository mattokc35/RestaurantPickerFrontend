import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import {v4 as uuidv4} from "uuid";
import { useRoleStore } from "../store/roleStore";

const HomePage = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const setRole = useRoleStore((state) => state.setRole);

  const handleJoinSession = () => {
    if (sessionId) {
      setRole("guest"); // Set role as guest
      navigate(`/session/${sessionId}`);
    }
  };

  const handleCreateSession = () => {
    const newSessionId = uuidv4();
    setRole("host"); // Set role as host
    navigate(`/session/${newSessionId}`);
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
      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#fff" }}>
        Create or Join a Room
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateSession}
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#ff5722",
          color: "#fff",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#ff1744" },
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
          input: { color: "#fff" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#888" },
            "&.Mui-focused fieldset": { borderColor: "#00bcd4" },
          },
          "& .MuiInputLabel-root": { color: "#aaa" },
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
          backgroundColor: "#ff5722",
          color: "#fff",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#ff1744" },
        }}
      >
        Join Room
      </Button>
    </Box>

  );
};

export default HomePage;
