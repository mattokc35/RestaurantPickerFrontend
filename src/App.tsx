import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SessionPage from "./components/SessionPage";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import "./App.css"

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:id" element={<SessionPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
