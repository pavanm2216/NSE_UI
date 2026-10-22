# MF Investor Debugging Guide

## Overview
This guide helps debug the SIP registration 400 error by checking three critical areas:
1. Scheme code population from API
2. ARN validation
3. Exact API error messages

---

## How to Debug

### Step 1: Open Browser Console
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Keep it open while testing the SIP flow

---

## What to Look For

### 1. **Scheme Code Population** ✅
Look for logs starting with `[Scheme Debug]`:

```
[Scheme Debug] Total schemes: 150
[Scheme Debug] First 5 schemes: [
  {
    name: "HDFC Top 100 Fund",
    parent_scheme_code: "IIITRG-GR",      ← Should NOT be empty
    scheme_isin: "INF090K01234",          ← Should NOT be empty
    scheme_amc_code: "HDFC"
  },
  ...
]
[Scheme Debug] Schemes without code: 0   ← Should be 0 or very low
```

**✅ Good:** `parent_scheme_code` and `scheme_isin` are populated  
**❌ Bad:** Both are empty or show "Unknown"

---

### 2. **ARN Validation** ✅
Look for logs starting with `[ARN Debug]` and `[ARN]`:

```
[ARN Debug] VITE_STARMF_ARN from env: ARN-92374
[ARN] Valid ARN found: ARN-92374
```

**✅ Good:** Shows valid ARN like `ARN-92374`  
**❌ Bad:** Shows warning about invalid format or using demo ARN

**If using demo ARN:**
```
[ARN] VITE_STARMF_ARN not configured in .env - using demo ARN
```

**Action:** Add to your `.env` file:
```
VITE_STARMF_ARN=ARN-XXXXX
```

---

### 3. **SIP Registration Error Messages** ✅
Look for logs starting with `[SIP Register]`:

```
[SIP Register] Sending payload: {
  sxp_type: "sip",
  mem_sxp_ref_id: "ORD26587533",
  investor_ucc: "SIPPhyWithoutNomin",
  member: "92374",
  src_scheme: "IIITRG-GR",              ← Should be valid scheme code
  amount: 2000,
  freq: "m",
  start_date: "2025-02-10",
  txn_date: 10
}

[SIP Register] ❌ API Error
[SIP Register] Status: 400
[SIP Register] Error Data: {
  status: "error",
  data: null,
  messages: [
    {
      errcode: "INVALID_SCHEME",
      message: "Scheme code not found in system",
      field: "src_scheme",
      vals: ["IIITRG-GR"]
    },
    {
      errcode: "INVALID_MEMBER",
      message: "Member ARN not registered",
      field: "member",
      vals: ["92374"]
    }
  ]
}

[SIP Register] Message 1: {
  errcode: "INVALID_SCHEME",
  message: "Scheme code not found in system",
  field: "src_scheme",
  vals: ["IIITRG-GR"]
}

[SIP Register] Message 2: {
  errcode: "INVALID_MEMBER",
  message: "Member ARN not registered",
  field: "member",
  vals: ["92374"]
}
```

---

## Common Issues & Solutions

### Issue 1: `src_scheme: "L-Unknown-Unknown"`
**Problem:** Scheme code is invalid  
**Cause:** `parent_scheme_code` and `isin` are empty from API  
**Solution:**
- Check if `/master_scheme_list` API is returning scheme codes
- Verify the API response has `parent_scheme_code` or `scheme_isin` fields
- Check if schemes are being filtered out incorrectly

### Issue 2: `member: "ARN-92374"` (with prefix)
**Problem:** ARN should be just the number, not with prefix  
**Cause:** `extractARNNumber()` not being called  
**Solution:**
- Verify `extractARNNumber(getARNFromEnv())` is being used
- Should extract `92374` from `ARN-92374`

### Issue 3: API returns `INVALID_SCHEME` or `INVALID_MEMBER`
**Problem:** API doesn't recognize the scheme code or member ARN  
**Cause:** 
- Scheme code format is wrong
- Member ARN is not registered with BSE
- Using demo/test data instead of real data

**Solution:**
- Verify scheme code format matches BSE requirements
- Verify ARN is registered and active
- Check if you need to use real scheme codes from the API

---

## Debug Checklist

- [ ] Open browser console (F12)
- [ ] Trigger SIP registration flow
- [ ] Check `[Scheme Debug]` logs - are scheme codes populated?
- [ ] Check `[ARN Debug]` logs - is ARN valid?
- [ ] Check `[SIP Register]` logs - what are the exact API error messages?
- [ ] Note down the error messages
- [ ] Share the console logs with the team

---

## How to Share Logs

1. Right-click in console → **Save as** → Save to file
2. Or copy-paste the relevant logs from console
3. Include:
   - `[Scheme Debug]` output
   - `[ARN Debug]` output
   - `[SIP Register]` error output

---

## Example: Complete Debug Flow

```
1. Load page
   ↓
   [Scheme Debug] Total schemes: 150
   [Scheme Debug] First 5 schemes: [...]
   
2. Click "Start SIP"
   ↓
   [ARN Debug] VITE_STARMF_ARN from env: ARN-92374
   [ARN] Valid ARN found: ARN-92374
   
3. Fill amount and click "Confirm"
   ↓
   [SIP Flow] Fund details: {...}
   [SIP Flow] Resolved scheme code: IIITRG-GR
   
4. Processing...
   ↓
   [SIP Register] Sending payload: {...}
   [SIP Register] ❌ API Error
   [SIP Register] Status: 400
   [SIP Register] Error Data: {...}
   [SIP Register] Message 1: {...}
```

---

## Next Steps

Once you have the debug logs:
1. Check if scheme codes are populated ✅
2. Check if ARN is valid ✅
3. Share the exact API error messages
4. We can then fix the specific validation issue
