const express = require('express');
const axios = require('axios');
const config = require('../config/env');

const router = express.Router();

// POST /api/bse/login
router.post('/login', async (req, res) => {
  try {
    const { data } = req.body;
    
    console.log('[BSE] Request received:', { username: data?.username });
    
    if (!data || !data.username || !data.password) {
      console.log('[BSE] Missing credentials');
      return res.status(400).json({
        status: 'error',
        error: 'Username and password are required'
      });
    }

    console.log('[BSE] Login attempt for user:', data.username);
    console.log('[BSE] Calling BSE API at: https://starmfv2demo.bseindia.com/api/login');

    // Call BSE API with correct endpoint
    const response = await axios.post(
      'https://starmfv2demo.bseindia.com/api/login',
      {
        data: {
          username: data.username,
          password: data.password
        }
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('[BSE] Login successful for user:', data.username);
    console.log('[BSE] Response status:', response.data?.status);
    
    // Return BSE response to frontend
    res.json(response.data);
  } catch (err) {
    console.error('[BSE] Login error:', err.message);
    console.error('[BSE] Error code:', err.code);
    console.error('[BSE] Error response status:', err.response?.status);
    console.error('[BSE] Error response data:', err.response?.data);
    
    // Handle different error types
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        status: 'error',
        error: 'Unable to connect to BSE API'
      });
    }
    
    if (err.code === 'ENOTFOUND') {
      return res.status(503).json({
        status: 'error',
        error: 'BSE API host not found'
      });
    }
    
    if (err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        status: 'error',
        error: 'BSE API request timeout'
      });
    }
    
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.messages?.[0] || 
                        err.response?.data?.error || 
                        err.message;
    
    res.status(statusCode).json({
      status: 'error',
      error: errorMessage
    });
  }
});

module.exports = router;
