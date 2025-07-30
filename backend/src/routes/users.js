const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const router = express.Router();

// Check if username exists
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await pool.query(
      'SELECT id, username FROM users WHERE username = $1',
      [username.trim()]
    );

    res.json({ 
      exists: result.rows.length > 0,
      user: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login or register user
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!password || password.length === 0) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (username.trim().length > 50) {
      return res.status(400).json({ error: 'Username must be 50 characters or less' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT id, username, password_hash, created_at FROM users WHERE username = $1',
      [username.trim()]
    );

    if (existingUser.rows.length > 0) {
      // User exists - verify password and log them in
      const user = existingUser.rows[0];
      
      // Handle legacy users without passwords
      if (!user.password_hash) {
        // For existing users without passwords, update their account with the provided password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        await pool.query(
          'UPDATE users SET password_hash = $1 WHERE id = $2',
          [passwordHash, user.id]
        );
        
        // Remove password_hash from response
        const { password_hash, ...userWithoutPassword } = user;
        
        res.json({
          message: 'Account updated with password successfully',
          user: userWithoutPassword,
          isNewUser: false
        });
        return;
      }
      
      // Verify password for users with passwords
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        isNewUser: false
      });
    } else {
      // User doesn't exist - create new user with hashed password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
        [username.trim(), passwordHash]
      );

      res.status(201).json({
        message: 'User created successfully',
        user: result.rows[0],
        isNewUser: true
      });
    }
  } catch (error) {
    console.error('Error creating/logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (for testing purposes)
router.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE username = $1 RETURNING id, username',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 