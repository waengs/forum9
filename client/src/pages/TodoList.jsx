import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase.jsx";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all"); // all | completed | incomplete
  const navigate = useNavigate();

  // Fetch todos based on the filter
  const fetchTodos = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      let url = "http://localhost:5000/todo";
      if (filter === "completed") url = "http://localhost:5000/todo/completed";
      else if (filter === "incomplete") url = "http://localhost:5000/todo/incomplete";

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/login"); // Redirect to login if unauthorized
      }
    }
  };

  // Fetch todos when the component is mounted or when the filter changes
  useEffect(() => {
    if (auth.currentUser) {
      fetchTodos();
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [filter]);

  // Add a new to-do
  const addTodo = async () => {
    if (!task.trim()) return; // Prevent adding empty task
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "http://localhost:5000/todo",
        { task },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTask(""); // Reset task input field
      fetchTodos(); // Refetch the to-do list
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Update a to-do (change task or toggle completion status)
  const updateTodo = async (id, updatedTask, completed) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(
        `http://localhost:5000/todo/${id}`,
        { task: updatedTask, completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTodos(); // Refetch the to-do list after update
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a single to-do
  const deleteTodo = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos(); // Refetch the to-do list after delete
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Delete all to-dos
  const deleteAllTodos = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete("http://localhost:5000/todo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos(); // Refetch the to-do list after delete all
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-white">Your To Do List</h2>

      {/* Add Task */}
      <div className="d-flex gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="New task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-success" onClick={addTodo}>
          Add Task
        </button>
        <button className="btn btn-danger" onClick={deleteAllTodos}>
          Delete All
        </button>
      </div>

      {/* Filter Options */}
      <div className="mb-4 text-center">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className="btn btn-outline-success mx-2"
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className="btn btn-outline-warning mx-2"
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>

      {/* To-Do List */}
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="list-group-item d-flex align-items-center justify-content-between"
            style={{
              position: "relative",
              padding: "20px",
              opacity: 0.75, // Set opacity to 75%
            }}
          >
            {/* Overlay to add opacity to the background */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg,rgb(25, 58, 95),rgb(181, 171, 187))",
                opacity: 0.75,
                zIndex: -1,
                borderRadius: "5px", // Optional, for rounded corners
              }}
            ></div>

            <div className="d-flex align-items-center w-100">
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={todo.completed}
                onChange={() =>
                  updateTodo(todo._id, todo.task, !todo.completed)
                }
              />
              <input
                type="text"
                className="form-control me-3"
                value={todo.task}
                onChange={(e) =>
                  updateTodo(todo._id, e.target.value, todo.completed)
                }
                style={{ color: "white", background: "transparent", border: "none" }}
              />
            </div>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
