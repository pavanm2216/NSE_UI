const express = require('express');
const router  = express.Router();

/**
 * In-memory order status store.
 * Key: order_id (string)
 * Value: { status, raw, updatedAt }
 *
 * Terminal statuses — polling stops when one of these is seen.
 */
const TERMINAL = new Set([
  'agency_payment_complete',
  'agency_rejected',
  'agency_cancelled',
  'done',
  'failed',
]);

const orderStore = new Map();

// ── POST /api/bse/webhook ─────────────────────────────────────────────────────
// BSE POSTs PAYMENT GATEWAY and ORDER events here as they happen.
// Register this URL with BSE as your webhook endpoint.
router.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('[BSE Webhook] Received:', JSON.stringify(body));

  // BSE sends either order_id or OrderId depending on event type
  const orderId =
    body?.order_id   ||
    body?.OrderId    ||
    body?.orderId    ||
    body?.sxp_reg_num; // SIP uses sxp_reg_num as the key

  const status =
    body?.status     ||
    body?.Status     ||
    body?.event_type ||
    body?.EventType;

  if (!orderId || !status) {
    console.warn('[BSE Webhook] Missing order_id or status — ignoring');
    return res.status(200).json({ received: true }); // always 200 to BSE
  }

  orderStore.set(String(orderId), {
    status:    String(status).toLowerCase(),
    raw:       body,
    updatedAt: Date.now(),
  });

  console.log(`[BSE Webhook] Stored: orderId=${orderId} status=${status}`);
  res.status(200).json({ received: true });
});

// ── GET /api/bse/order-status/:orderId ────────────────────────────────────────
// Frontend polls this after the redirect lands.
router.get('/order-status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const entry = orderStore.get(String(orderId));

  if (!entry) {
    // No webhook received yet — still pending
    return res.json({ orderId, status: 'pending', terminal: false });
  }

  res.json({
    orderId,
    status:    entry.status,
    terminal:  TERMINAL.has(entry.status),
    updatedAt: entry.updatedAt,
    raw:       entry.raw,
  });
});

module.exports = router;
