import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import SessionPage from "./components/SessionPage";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import "./App.css";

function NotFoundRedirect() {
  return <Navigate to="/" />;
}

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:id" element={<SessionPage />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;