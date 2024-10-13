import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";
import RestaurantForm from "./RestaurantForm";
import SpinWheel from "./SpinWheel";
import { useRoleStore } from "../store/roleStore";
import {
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Icons
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import IcecreamIcon from "@mui/icons-material/Icecream";

const SessionPage = () => {
  const { socket, connected } = useWebSocket();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const role = useRoleStore((state) => state.role);
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (socket && id) {
      if (role === "host") {
        socket.emit("create-session", id);
      }
      // Get the current list of restaurants when joining the session
      socket.on("current-restaurants", (restaurantList: string[]) => {
        debugger;
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

      socket.on("current-users", ({ count }: { count: number }) => {
        debugger;
        setUserCount(count);
      });

      socket.on("session-deleted", () => {
        alert("The session was deleted.");
        navigate("/"); // Redirect to home page
      });

      // Clean up the socket listeners on component unmount
      return () => {
        socket.off("current-restaurants");
        socket.off("restaurant-suggested");
        socket.off("restaurant-selected");
        socket.off("role-assigned");
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
        backgroundColor: "#fff3e0", // Lighter, playful background
        color: theme.palette.text.primary,
        padding: isMobile ? "20px" : "40px",
        textAlign: "center",
        overflowY: "auto", // Allows scrolling for overflowing content
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <RestaurantIcon sx={{ color: "#ff9800", fontSize: 50 }} />
        <FastfoodIcon sx={{ color: "#ff5722", fontSize: 50 }} />
        <LocalPizzaIcon sx={{ color: "#ff1744", fontSize: 50 }} />
        <IcecreamIcon sx={{ color: "#ffc107", fontSize: 50 }} />
      </Stack>

      <Box
        sx={{
          width: isMobile ? "90%" : "620px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: isMobile ? "transparent" : "#fff3e0", // White background for cards
          borderRadius: isMobile ? "0px" : "12px",
          padding: isMobile ? "10px" : "30px",
          boxShadow: isMobile ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            marginBottom: "20px",
            fontWeight: 500,
            color: "#333", // Darker text for contrast
          }}
        >
          Room ID: {id}
        </Typography>
        {connected && role ? (
          <>
            {role === "host" ? (
              <>
                <Typography sx={{ color: "#4CAF50", fontWeight: "bold" }}>
                  You are the Host. Please suggest a restaurant and wait for other guests to submit their restaurants as well. You can then spin the wheel or start a game!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#777",
                    marginBottom: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {userCount}/10 foodies joined{" "}
                </Typography>
              </>
            ) : (
              <Typography sx={{ color: "#F44336", fontWeight: "bold" }}>
                You are a Guest. Please suggest a restaurant then wait for the host to spin the wheel or start the game!
              </Typography>
            )}

            <RestaurantForm />
            <Box sx={{ width: "100%", marginTop: "20px" }}>
              <Typography
                variant="h6"
                sx={{ color: "#333", marginBottom: "10px" }}
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
                    padding: 0,
                  }}
                >
                  {restaurants.map((r, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: "#F1F1F1",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#EAEAEA",
                        },
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#333", fontWeight: "bold" }}
                      >
                        {r}
                      </Typography>
                      {/* Add a playful food icon next to each restaurant */}
                      <FastfoodIcon sx={{ color: "#ff9800" }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="h6" sx={{ color: "#aaa" }}>
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
