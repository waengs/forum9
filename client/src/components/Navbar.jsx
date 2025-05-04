import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">To Do App</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutme" className="nav-link">About Me</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/todolist" className="nav-link">To Do List</Link>
                </li>
                <li className="nav-item d-flex align-items-center">
                    <button
                        onClick={handleLogout}
                        className="btn ms-lg-3 mt-2 mt-lg-0 px-3 fw-semibold"
                        style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        border: "2px solid white",
                        borderRadius: "20px",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0b5ed7")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#0d6efd")}
                    >
                        Logout
                    </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
