import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.jsx";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/todolist");
    } catch (err) {
      setError("Sign-up failed: " + err.message);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-white">
      <div
        className="p-4 shadow rounded"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: "#d3d3d3",
                border: "1px solid white",
                color: "#000000",
              }}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#d3d3d3",
                border: "1px solid white",
                color: "#000000",
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-light w-100">
            Sign Up
          </button>
        </form>
        {error && <div className="text-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default SignUpPage;
