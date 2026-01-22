const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all todos for user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
});

// Create new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const todo = new Todo({
      title,
      description,
      user: req.user.id
    });
    
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
});

module.exports = router;