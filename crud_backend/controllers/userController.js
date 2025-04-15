import User from '../models/userModel.js';
import { validationResult } from 'express-validator';

// Create
export const createUser = async (req, res) => {
   
  // 1) express-validator check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = new User(req.body);
    const saved = await user.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error in createUser:', err.message);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Get All with Pagination
export const getUsers = async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip  = (page - 1) * limit;


  try {
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments()
    ]);
    return res.json({ total, page, users });
  } catch (err) {
    console.error('Error in getUsers:', err.message);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Get by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.warn('User not found:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Error in getUserById:', err.message);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Update
export const updateUser = async (req, res) => {
  // 1) express-validator check for update too
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors (update):', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }      // enforce schema validation
    );

    if (!updatedUser) {
      console.warn('User not found for update:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (err) {
    console.error('Error in updateUser:', err.message);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Delete
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn('User not found for delete:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err.message);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
};
