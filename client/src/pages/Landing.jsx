import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function LandingPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center text-white">
      <h1 className="display-4 fw-bold mb-4">Welcome to Your To Do App</h1>
      <p>Organize your tasks efficiently.</p>
    </div>
  );
}

export default LandingPage;
