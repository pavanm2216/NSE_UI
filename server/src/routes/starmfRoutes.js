const express = require('express');
const axios   = require('axios');
const config  = require('../config/env');

const router   = express.Router();
const STARMF_BASE = config.starmf.baseUrl;

// ── Token cache ───────────────────────────────────────────────────────────────
let cachedToken = null;
let tokenExpiry  = 0;
const TOKEN_TTL  = 23 * 60 * 60 * 1000; // 23 hours

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  console.log('[StarMF] Logging in as:', config.starmf.username);
  try {
    const { data } = await axios.post(`${STARMF_BASE}/login`, {
      data: { username: config.starmf.username, password: config.starmf.password },
    });
    console.log('[StarMF] Login response:', JSON.stringify(data));
    const token = data?.data?.access_token;
    if (!token) throw new Error(data?.message || 'StarMF login failed');
    cachedToken = token;
    tokenExpiry  = Date.now() + TOKEN_TTL;
    console.log('[StarMF] Token cached successfully');
    return token;
  } catch (err) {
    console.error('[StarMF] Token fetch error:', err.message);
    throw err;
  }
}

// ── Generic proxy ─────────────────────────────────────────────────────────────
async function proxyPost(res, path, body = {}) {
  console.log('[StarMF] proxyPost ->', path);
  console.log('[StarMF] Request body:', JSON.stringify(body, null, 2));
  try {
    const token = await getToken();
    const { data } = await axios.post(`${STARMF_BASE}${path}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[StarMF] Response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    console.error('[StarMF] Error response:', err.response?.status, JSON.stringify(err.response?.data, null, 2));
    // If token expired mid-session, clear cache and retry once
    if (err.response?.status === 401) {
      cachedToken = null;
      try {
        const token = await getToken();
        const { data } = await axios.post(`${STARMF_BASE}${path}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json(data);
      } catch (retryErr) {
        return res.status(retryErr.response?.status || 500).json({ error: retryErr.message });
      }
    }
    res.status(err.response?.status || 500).json({ error: err.message });
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
// Login: accept credentials from request body (user-supplied) or fall back to env
router.post('/login', async (req, res) => {
  const username = req.body?.data?.username || config.starmf.username;
  const password = req.body?.data?.password || config.starmf.password;
  console.log('[StarMF] /login called for user:', username);
  
  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { data } = await axios.post(`${STARMF_BASE}/login`, {
      data: { username, password },
    });
    
    console.log('[StarMF] Login successful for user:', username);
    const token = data?.data?.access_token;
    if (token) {
      // If using env credentials, also update the cache
      if (username === config.starmf.username) {
        cachedToken = token;
        tokenExpiry = Date.now() + TOKEN_TTL;
        console.log('[StarMF] Token cached for env credentials');
      }
    }
    res.json(data);
  } catch (err) {
    console.error('[StarMF] Login error:', err.message);
    console.error('[StarMF] Error details:', err.response?.status, err.response?.data);
    
    const statusCode = err.response?.status || 500;
    const raw = err.response?.data?.messages?.[0];
    const errorMessage = typeof raw === 'string'
      ? raw
      : (raw?.errcode || raw?.field)
        ? `${raw.errcode || ''}${raw.field ? ' — field: ' + raw.field : ''}`
        : err.response?.data?.error || err.message;

    res.status(statusCode).json({ error: errorMessage, status: 'error' });
  }
});

router.post('/master_scheme_list', (req, res) =>
  proxyPost(res, '/master_scheme_list', req.body));

router.post('/nav_master_list', (req, res) =>
  proxyPost(res, '/nav_master_list', req.body));

router.post('/order', (req, res) =>
  proxyPost(res, '/order', req.body));

router.post('/sxp', (req, res) =>
  proxyPost(res, '/sxp', req.body));

// Generic catch-all for any other StarMF POST endpoints
router.post('/*', (req, res) =>
  proxyPost(res, `/${req.params[0]}`, req.body));

module.exports = router;
