import dotenv from 'dotenv';
dotenv.config(); // Loads the .env file

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { auth } from './firebase.js';
import Todo from './models/Todo.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do List API',
      version: '1.0.0',
      description: 'API for managing to-do lists',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./index.js'], // Path to your API route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Firebase Authentication middleware
const authenticateFirebase = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(403).send('Access denied');

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.userId = decodedToken.uid;  // Attach userId to request object
    next();
  } catch (error) {
    res.status(403).send('Invalid or expired token');
  }
};

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Get all to-do tasks
 *     description: Retrieve all to-do items for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved to-dos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: string
 *                     description: The task description
 *                     example: "Buy groceries"
 */
app.get('/todo', authenticateFirebase, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

/**
 * @swagger
 * /todo/completed:
 *   get:
 *     summary: Get completed to-do tasks
 *     description: Retrieve all completed to-do items for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved completed to-dos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: string
 *                     description: The task description
 *                     example: "Finish homework"
 */
app.get('/todo/completed', authenticateFirebase, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId, completed: true });
  res.json(todos);
});

/**
 * @swagger
 * /todo/incomplete:
 *   get:
 *     summary: Get incomplete to-do tasks
 *     description: Retrieve all incomplete to-do items for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved incomplete to-dos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: string
 *                     description: The task description
 *                     example: "Finish homework"
 */
app.get('/todo/incomplete', authenticateFirebase, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId, completed: false });
  res.json(todos);
});

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Add a new to-do task
 *     description: Add a new to-do item to the list for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 description: The task to add
 *                 example: "Finish homework"
 *     responses:
 *       201:
 *         description: Successfully created to-do
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: string
 *                   description: The task description
 *                   example: "Finish homework"
 */
app.post('/todo', authenticateFirebase, async (req, res) => {
  const { task } = req.body;

  const todo = new Todo({
    task,
    completed: false,
    userId: req.userId,
  });

  await todo.save();
  res.status(201).json(todo);
});

/**
 * @swagger
 * /todo/{id}:
 *   put:
 *     summary: Edit an existing to-do task
 *     description: Update a to-do item by its ID for the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the to-do task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 description: The updated task description
 *                 example: "Complete the homework"
 *               completed:
 *                 type: boolean
 *                 description: Mark the task as completed or not
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the to-do
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: string
 *                   description: The task description
 *                   example: "Complete the homework"
 *                 completed:
 *                   type: boolean
 *                   description: Task completion status
 *                   example: true
 */
app.put('/todo/:id', authenticateFirebase, async (req, res) => {
  const { task, completed } = req.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { task, completed },
    { new: true }
  );

  if (!todo) return res.status(404).send('Task not found');
  res.json(todo);
});

/**
 * @swagger
 * /todo/{id}:
 *   delete:
 *     summary: Delete a to-do task by ID
 *     description: Delete a specific to-do item by its ID for the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the to-do task to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the to-do
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted"
 */
app.delete('/todo/:id', authenticateFirebase, async (req, res) => {
  const result = await Todo.deleteOne({ _id: req.params.id, userId: req.userId });

  if (result.deletedCount === 0) return res.status(404).send('Task not found');
  res.json({ message: 'Task deleted' });
});

/**
 * @swagger
 * /todo:
 *   delete:
 *     summary: Delete all to-do tasks
 *     description: Delete all to-do items for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully deleted all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All tasks deleted"
 */
app.delete('/todo', authenticateFirebase, async (req, res) => {
  await Todo.deleteMany({ userId: req.userId });
  res.json({ message: 'All tasks deleted' });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});