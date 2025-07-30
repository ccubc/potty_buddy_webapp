const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Log new event
router.post('/', async (req, res) => {
  try {
    const { userId, eventType } = req.body;
    
    if (!userId || !eventType) {
      return res.status(400).json({ error: 'User ID and event type are required' });
    }

    if (!['dirty_pants', 'potty'].includes(eventType)) {
      return res.status(400).json({ error: 'Invalid event type. Must be "dirty_pants" or "potty"' });
    }

    // Verify user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log the event
    const result = await pool.query(
      'INSERT INTO events (user_id, event_type) VALUES ($1, $2) RETURNING id, event_type, created_at',
      [userId, eventType]
    );

    res.status(201).json({
      message: 'Event logged successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's events for statistics (last 14 days)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get events from last 14 days
    const result = await pool.query(
      `SELECT 
        event_type,
        DATE(created_at) as date,
        COUNT(*) as count
       FROM events 
       WHERE user_id = $1 
         AND created_at >= NOW() - INTERVAL '14 days'
       GROUP BY event_type, DATE(created_at)
       ORDER BY date DESC, event_type`,
      [userId]
    );

    // Get total counts for last 14 days
    const totals = await pool.query(
      `SELECT 
        event_type,
        COUNT(*) as total_count
       FROM events 
       WHERE user_id = $1 
         AND created_at >= NOW() - INTERVAL '14 days'
       GROUP BY event_type`,
      [userId]
    );

    const statistics = {
      dailyEvents: result.rows,
      totals: totals.rows.reduce((acc, row) => {
        acc[row.event_type] = parseInt(row.total_count);
        return acc;
      }, {})
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 