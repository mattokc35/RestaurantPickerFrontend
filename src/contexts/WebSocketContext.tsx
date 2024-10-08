import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type WebSocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
});

export const WebSocketProvider: React.FC<any> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_ENV === 'dev' ? import.meta.env.VITE_BACKEND_BASE_URL : import.meta.env.VITE_BACKEND_PRODUCTION_URL);
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      setConnected(true);
    });

    socketConnection.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
