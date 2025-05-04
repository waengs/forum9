import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import TodoListPage from "./pages/TodoList";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import Navbar from "./components/Navbar"; // Import Navbar component
import './App.css';

function App() {
  return (
    <Router> {/* Wrap Routes with BrowserRouter */}
      <div>
        <Navbar /> {/* Display the Navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/todolist" element={<TodoListPage />} />
          <Route path="/aboutme" element={<ProfilePage />} /> {/* Route for ProfilePage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
