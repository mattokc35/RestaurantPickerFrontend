import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";
import RestaurantForm from "../components/RestaurantForm";
import SpinWheel from "../components/SpinWheel";
import { useRoleStore } from "../store/roleStore";
import {
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  Button,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import IcecreamIcon from "@mui/icons-material/Icecream";
import MessageDisplay from "../components/MessageDisplay";

export interface Restaurant {
  name: string;
  suggestedBy: string;
}

const SessionPage = () => {
  const { socket, connected } = useWebSocket();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // To handle route changes
  const role = useRoleStore((state) => state.role);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sessionDeleted, setSessionDeleted] = useState<boolean>(false); // State to control modal visibility
  const [leaveWarning, setLeaveWarning] = useState<boolean>(false); // To control the leave warning modal
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  ); // To store the navigation path
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (socket && id) {
      if (role === "host") {
        socket.emit("create-session", id);
      } else {
        socket.emit("join-session", id);
      }

      // Get the current list of restaurants when joining the session
      socket.on("current-restaurants", (restaurantList: Restaurant[]) => {
        setRestaurants(restaurantList);
      });

      // Add new suggested restaurants
      socket.on("restaurant-suggested", (newRestaurant: Restaurant) => {
        setRestaurants((prev) => [...prev, newRestaurant]);
      });

      // Handle restaurant selection after spinning the wheel
      socket.on("restaurant-selected", (restaurant: string) => {
        setSuccessMessage(`Selected restaurant: ${restaurant}`);
      });

      // Handle updated user count
      socket.on("current-users", ({ count }: { count: number }) => {
        setUserCount(count);
      });

      // Handle session deletion - show modal
      socket.on("session-deleted", () => {
        setSessionDeleted(true);
      });

      // Clean up socket listeners when component unmounts
      return () => {
        socket.emit("leave-session", id);
        socket.off("current-restaurants");
        socket.off("restaurant-suggested");
        socket.off("restaurant-selected");
        socket.off("current-users");
        socket.off("session-deleted");
      };
    }
  }, [socket, id, role, navigate]);

  // Handle the "OK" button in the session deleted modal
  const handleModalClose = () => {
    setSessionDeleted(false);
    navigate("/"); // Navigate back to home
  };

  // Handle the "Yes" button in the leave warning modal
  const confirmLeave = () => {
    setLeaveWarning(false);
    if (pendingNavigation) {
      navigate(pendingNavigation); // Navigate to the desired path
    }
  };

  // Handle the "No" button in the leave warning modal
  const cancelLeave = () => {
    setLeaveWarning(false);
    setPendingNavigation(null); // Reset pending navigation
  };

  // Intercept route change attempts
  useEffect(() => {}, [location.pathname, navigate]);

  // Warn before closing the browser or tab
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Modern browsers require setting returnValue
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
          boxShadow: "none",
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
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  You are the Host. Please suggest a restaurant and wait for
                  other guests to submit their restaurants as well. You can then
                  spin the wheel or start a game!
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "#F44336" }}>
                You are a Guest. Please suggest a restaurant then wait for the
                host to spin the wheel or start the game!
              </Typography>
            )}
            {userCount && (
              <Typography
                variant="body1"
                sx={{
                  color: "#777",
                  marginBottom: "10px",
                  marginTop: "10px",
                  fontStyle: "italic",
                }}
              >
                {userCount}/10 foodies joined{" "}
              </Typography>
            )}

            <RestaurantForm sessionId={id} />
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
                  {restaurants.map((restaurant, index) => (
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
                        {restaurant.name} ({restaurant.suggestedBy})
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

      {/* Display success messages */}
      <MessageDisplay message={successMessage} type="validation" />

      {/* Modal for session deletion */}
      <Modal
        open={sessionDeleted}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "#ff5722" }}
          >
            Session Deleted
          </Typography>
          <Typography id="modal-description" sx={{ color: "#ff5722", mt: 2 }}>
            The session has been deleted by the host.
          </Typography>
          <Button
            onClick={handleModalClose}
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#ff5722", color: "#fff" }}
          >
            Back To Home
          </Button>
        </Box>
      </Modal>

      {/* Modal for leaving the session */}
      <Modal
        open={leaveWarning}
        onClose={cancelLeave}
        aria-labelledby="leave-modal-title"
        aria-describedby="leave-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            id="leave-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "#ff5722" }}
          >
            {role === "host"
              ? "Leaving will delete the room"
              : "Leaving will leave the room"}
          </Typography>
          <Typography
            id="leave-modal-description"
            sx={{ color: "#ff5722", mt: 2 }}
          >
            {role === "host"
              ? "You are the host, leaving will delete the room and kick everyone out."
              : "Leaving will remove you from the room and delete your restaurant suggestion."}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
            <Button
              onClick={confirmLeave}
              variant="contained"
              sx={{ backgroundColor: "#ff5722", color: "#fff" }}
            >
              Yes
            </Button>
            <Button
              onClick={cancelLeave}
              variant="outlined"
              sx={{ color: "#ff5722", borderColor: "#ff5722" }}
            >
              No
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default SessionPage;
