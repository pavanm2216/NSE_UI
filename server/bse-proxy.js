/**
 * BSE StAR MF API Proxy Server
 * This server proxies requests to BSE API with authentication
 * 
 * Usage: node server/bse-proxy.js
 * Then configure vite.config.ts to proxy to http://localhost:5000
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001;

// BSE API Configuration
const BSE_API_BASE = 'https://starmfv2demo.bseindia.com/api';
const BSE_LOGIN_ID = process.env.BSE_LOGIN_ID || 'member/92374/lendrixventechprivatelimited';
const BSE_PASSWORD = process.env.BSE_PASSWORD || 'Member@123';

let authToken = null;
let tokenExpiry = null;

// Middleware
app.use(cors());
app.use(express.json());

// Create axios instance for BSE API
const bseApi = axios.create({
  baseURL: BSE_API_BASE,
  timeout: 10000,
});

// Function to get authentication token
async function getAuthToken() {
  try {
    // Check if token is still valid
    if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
      console.log('[BSE Auth] Using cached token');
      return authToken;
    }

    console.log('[BSE Auth] Requesting new token...');
    console.log('[BSE Auth] Username:', BSE_LOGIN_ID);
    
    const response = await bseApi.post('/login', {
      data: {
        username: BSE_LOGIN_ID,
        password: BSE_PASSWORD,
      },
    });

    console.log('[BSE Auth] Response:', JSON.stringify(response.data, null, 2));

    authToken = response.data?.data?.access_token || response.data?.data?.token || response.data?.token;
    // Token valid for ~30 minutes (expires in 1800 seconds), refresh after 25 minutes
    tokenExpiry = Date.now() + (25 * 60 * 1000);

    console.log('[BSE Auth] ✅ Token obtained successfully');
    return authToken;
  } catch (error) {
    console.error('[BSE Auth] ❌ Failed to get token');
    console.error('[BSE Auth] Status:', error.response?.status);
    console.error('[BSE Auth] Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('[BSE Auth] Message:', error.message);
    throw error;
  }
}}}

// Add authentication interceptor
bseApi.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[BSE Request] Token added to request');
    }
  } catch (error) {
    console.error('[BSE Interceptor] Error getting token:', error.message);
  }
  return config;
});

// Proxy all POST requests
app.post('/*', async (req, res) => {
  try {
    const endpoint = req.path;
    console.log(`[BSE Proxy] POST ${endpoint}`);
    
    const response = await bseApi.post(endpoint, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(`[BSE Proxy] Error:`, error.message);
    
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    
    res.status(status).json(data);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BSE Proxy Server is running',
    authenticated: !!authToken,
  });
});

// Login endpoint for testing
app.post('/test-login', async (req, res) => {
  try {
    const token = await getAuthToken();
    res.json({ 
      status: 'success',
      message: 'Authentication successful',
      token: token ? '***' : null,
    });
  } catch (error) {
    res.status(401).json({ 
      status: 'error',
      message: 'Authentication failed',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ BSE Proxy Server running on http://localhost:${PORT}`);
  console.log(`📝 Using BSE Credentials:`);
  console.log(`   Login ID: ${BSE_LOGIN_ID}`);
  console.log(`   Environment: Demo\n`);
  console.log(`🔗 Test authentication: http://localhost:${PORT}/health\n`);
});
