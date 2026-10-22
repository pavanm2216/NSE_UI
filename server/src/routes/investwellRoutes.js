const express = require('express');
const axios   = require('axios');
const config  = require('../config/env');

const router = express.Router();
const IW_BASE = config.investwell.baseUrl; // https://lendrixventech.investwell.app/api

// ── Token cache (14-min TTL matching Investwell session) ──────────────────────
let cachedToken = null;
let tokenExpiry  = 0;
const TOKEN_TTL  = 14 * 60 * 1000;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const { data } = await axios.post(
    `${IW_BASE}/aggregator/auth/getAuthorizationToken`,
    { authName: config.investwell.authName, password: config.investwell.password },
  );
  if (data.status !== 0 || !data.result?.token)
    throw new Error(data.message || 'Investwell auth failed');
  cachedToken = data.result.token;
  tokenExpiry  = Date.now() + TOKEN_TTL;
  return cachedToken;
}

// ── Generic proxy helper ──────────────────────────────────────────────────────
async function proxyGet(res, path, params = {}) {
  try {
    const token = await getToken();
    const { data } = await axios.get(`${IW_BASE}${path}`, {
      params,
      headers: { token },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
}

async function proxyPost(res, path, body = {}) {
  try {
    const token = await getToken();
    const { data } = await axios.post(`${IW_BASE}${path}`, body, {
      headers: { token },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Investment Snapshot
router.get('/reports/getInvestmentSnapShot', (req, res) =>
  proxyGet(res, '/aggregator/reports/getInvestmentSnapShot', req.query));

// Portfolio Returns
router.get('/reports/getPortfolioReturns', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortfolioReturns', req.query));

// Portfolio Returns Detailed
router.get('/reports/getPortfolioReturnsDetailed', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortfolioReturnsDetailed', req.query));

// Shares & Bonds
router.get('/reports/getPortFolioReturnsForSharesAndBonds', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortFolioReturnsForSharesAndBonds', req.query));

// Fixed Assets
router.get('/reports/getPortfolioReturnsForFixedAssets', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortfolioReturnsForFixedAssets', req.query));

// Other Assets
router.get('/reports/getPortfolioForOtherAssets', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortfolioForOtherAssets', req.query));

// AUM Journey chart
router.get('/utils/getNavDateVSAUMNetInvGraph', (req, res) =>
  proxyGet(res, '/aggregator/utils/getNavDateVSAUMNetInvGraph', req.query));

// Capital Gains
router.get('/reports/getRealizedCapitalGain', (req, res) =>
  proxyGet(res, '/aggregator/reports/getRealizedCapitalGain', req.query));

router.get('/reports/getRealizedCapitalGainV2', (req, res) =>
  proxyGet(res, '/aggregator/reports/getRealizedCapitalGainV2', req.query));

router.get('/reports/getUnrealizedCapitalGain', (req, res) =>
  proxyGet(res, '/aggregator/reports/getUnrealizedCapitalGain', req.query));

router.get('/reports/getUnrealizedCapitalGainV2', (req, res) =>
  proxyGet(res, '/aggregator/reports/getUnrealizedCapitalGainV2', req.query));

router.get('/reports/getUnrealizedCapitalGainSbV2', (req, res) =>
  proxyGet(res, '/aggregator/reports/getUnrealizedCapitalGainSbV2', req.query));

// Portfolio Summary
router.get('/reports/getPortfolioSummaryForMutualFunds', (req, res) =>
  proxyGet(res, '/aggregator/reports/getPortfolioSummaryForMutualFunds', req.query));

// SOA (Transactions)
router.get('/reports/getSOA', (req, res) =>
  proxyGet(res, '/aggregator/reports/getSOA', req.query));

// Client Transactions
router.get('/reports/getClientTransactions', (req, res) =>
  proxyGet(res, '/aggregator/reports/getClientTransactions', req.query));

// BSE RTA Transactions
router.get('/aggregator/utils/getBSETxnDetails', (req, res) =>
  proxyGet(res, '/aggregator/utils/getBSETxnDetails', req.query));

// Broker — get clients
router.get('/broker/getClients', (req, res) =>
  proxyGet(res, '/broker/getClients', req.query));

// Auth token (for MF login page)
router.post('/auth/getAuthorizationToken', (req, res) =>
  proxyPost(res, '/aggregator/auth/getAuthorizationToken', req.body));

module.exports = router;
