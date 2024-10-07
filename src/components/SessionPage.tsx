import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";
import RestaurantForm from "./RestaurantForm";
import SpinWheel from "./SpinWheel";
import {
  Box,
  Typography,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const SessionPage = () => {
  const { socket, connected } = useWebSocket();
  const { id } = useParams<{ id: string }>();
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (socket) {
      // Emit the join-session event
      socket.emit("join-session", id);

      // Get the current list of restaurants when joining the session
      socket.on("current-restaurants", (restaurantList: string[]) => {
        setRestaurants(restaurantList);
      });

      // Add new suggested restaurants
      socket.on("restaurant-suggested", (restaurant: string) => {
        setRestaurants((prev) => [...prev, restaurant]);
      });

      // Handle restaurant selection after spinning the wheel
      socket.on("restaurant-selected", (restaurant: string) => {
        alert(`Selected restaurant: ${restaurant}`);
      });

      // Clean up the socket listeners on component unmount
      return () => {
        socket.off("current-restaurants");
        socket.off("restaurant-suggested");
        socket.off("restaurant-selected");
      };
    }
  }, [socket, id]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh", // Ensures full viewport height
        minWidth: "auto",
        backgroundColor: "#242424",
        color: theme.palette.text.primary,
        padding: isMobile ? "20px" : "40px",
        textAlign: "center",
        overflowY: "auto", // Allows scrolling for overflowing content
      }}
    >
      <Box
        sx={{
          width: isMobile ? "90%" : "620px",
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
          Room ID: {id}
        </Typography>
        {connected ? (
          <>
            <RestaurantForm />
            <Box sx={{ width: "100%", marginTop: "20px" }}>
              <Typography
                variant="h6"
                sx={{ color: "#fff", marginBottom: "10px" }}
              >
                Suggested Restaurants:
              </Typography>
              {restaurants.length > 0 ? (
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "transparent",
                    borderRadius: "8px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {restaurants.map((r, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: "#1E1E1E",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#2C2C2C",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#E0E0E0", fontWeight: "bold" }}
                      >
                        {r}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="h6" sx={{ color: "#ccc" }}>
                  None
                </Typography>
              )}
            </Box>
            <Box sx={{ marginTop: "30px" }}>
              {restaurants.length > 0 && (
                <SpinWheel restaurants={restaurants} />
              )}
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            Connecting...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SessionPage;
