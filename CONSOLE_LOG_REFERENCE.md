# Console Log Quick Reference

## 🔍 What to Look For in Browser Console

### 1️⃣ SCHEME CODE CHECK
**Look for:** `[Scheme Debug]` logs

```
✅ GOOD:
[Scheme Debug] Total schemes: 150
[Scheme Debug] First 5 schemes: [
  {
    name: "HDFC Top 100 Fund",
    parent_scheme_code: "IIITRG-GR",
    scheme_isin: "INF090K01234",
    scheme_amc_code: "HDFC"
  }
]
[Scheme Debug] Schemes without code: 0

❌ BAD:
[Scheme Debug] Total schemes: 150
[Scheme Debug] First 5 schemes: [
  {
    name: "HDFC Top 100 Fund",
    parent_scheme_code: "",
    scheme_isin: "",
    scheme_amc_code: "HDFC"
  }
]
[Scheme Debug] Schemes without code: 45
```

**What it means:**
- ✅ GOOD: Scheme codes are populated from API
- ❌ BAD: Scheme codes are empty - API not returning them

---

### 2️⃣ ARN VALIDATION CHECK
**Look for:** `[ARN Debug]` and `[ARN]` logs

```
✅ GOOD:
[ARN Debug] VITE_STARMF_ARN from env: ARN-92374
[ARN] Valid ARN found: ARN-92374

❌ BAD (Not configured):
[ARN Debug] VITE_STARMF_ARN from env: undefined
[ARN] VITE_STARMF_ARN not configured in .env - using demo ARN

❌ BAD (Invalid format):
[ARN Debug] VITE_STARMF_ARN from env: 92374
[ARN] Invalid ARN format in .env: 92374
[ARN] Expected format: ARN-XXXXX or ARN-XXXXXXXX (5-8 digits)
[ARN] Using demo ARN instead
```

**What it means:**
- ✅ GOOD: Valid ARN configured
- ❌ BAD: ARN not configured or invalid format

**Fix:** Add to `.env`:
```
VITE_STARMF_ARN=ARN-XXXXX
```

---

### 3️⃣ FUND DETAILS CHECK
**Look for:** `[SIP Flow]` logs

```
✅ GOOD:
[SIP Flow] Fund details: {
  name: "HDFC Top 100 Fund",
  parentSchemeCode: "IIITRG-GR",
  isin: "INF090K01234",
  amcCode: "HDFC",
  rtaCode: "HDFC001",
  plan: "Direct",
  option: "Growth"
}
[SIP Flow] Resolved scheme code: IIITRG-GR

❌ BAD:
[SIP Flow] Fund details: {
  name: "HDFC Top 100 Fund",
  parentSchemeCode: "",
  isin: "",
  amcCode: "HDFC",
  rtaCode: "",
  plan: "Direct",
  option: "Growth"
}
[SIP Flow] Resolved scheme code: L-Unknown-Unknown
```

**What it means:**
- ✅ GOOD: Fund has valid scheme code
- ❌ BAD: Fund missing scheme code - will fail at API

---

### 4️⃣ SIP REGISTRATION REQUEST CHECK
**Look for:** `[SIP Register] Sending payload:` log

```
✅ GOOD:
[SIP Register] Sending payload: {
  sxp_type: "sip",
  mem_sxp_ref_id: "ORD26587533",
  investor_ucc: "SIPPhyWithoutNomin",
  member: "92374",
  src_scheme: "IIITRG-GR",
  amount: 2000,
  freq: "m",
  start_date: "2025-02-10",
  txn_date: 10
}

❌ BAD:
[SIP Register] Sending payload: {
  sxp_type: "sip",
  mem_sxp_ref_id: "ORD26587533",
  investor_ucc: "SIPPhyWithoutNomin",
  member: "92374",
  src_scheme: "L-Unknown-Unknown",  ← INVALID!
  amount: 2000,
  freq: "m",
  start_date: "2025-02-10",
  txn_date: 10
}
```

**What it means:**
- ✅ GOOD: All fields look valid
- ❌ BAD: `src_scheme` is invalid

---

### 5️⃣ SIP REGISTRATION ERROR CHECK
**Look for:** `[SIP Register] ❌ API Error` log

```
✅ SUCCESS:
[SIP Register] Success response: {
  data: {
    id: 12345,
    status: "ACTIVE",
    message: "SIP registered successfully"
  }
}

❌ ERROR:
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
      vals: ["L-Unknown-Unknown"]
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
  vals: ["L-Unknown-Unknown"]
}

[SIP Register] Message 2: {
  errcode: "INVALID_MEMBER",
  message: "Member ARN not registered",
  field: "member",
  vals: ["92374"]
}
```

**What it means:**
- ✅ SUCCESS: SIP registered successfully
- ❌ ERROR: API rejected the request with specific error codes

**Common error codes:**
- `INVALID_SCHEME` - Scheme code not recognized by BSE
- `INVALID_MEMBER` - Member ARN not registered with BSE
- `INVALID_INVESTOR` - Investor UCC not valid
- `INVALID_DATE` - Start date is invalid or in past

---

## 📋 Debugging Checklist

When you see the 400 error, check in this order:

- [ ] **Step 1:** Check `[Scheme Debug]` - Are scheme codes populated?
  - If NO → Issue with `/master_scheme_list` API
  - If YES → Go to Step 2

- [ ] **Step 2:** Check `[ARN Debug]` - Is ARN valid?
  - If NO → Configure `VITE_STARMF_ARN` in `.env`
  - If YES → Go to Step 3

- [ ] **Step 3:** Check `[SIP Flow]` - Is scheme code resolved correctly?
  - If NO (shows "Unknown") → Issue with scheme data
  - If YES → Go to Step 4

- [ ] **Step 4:** Check `[SIP Register]` error messages
  - Note the exact `errcode` and `message`
  - This tells us what the API is rejecting

---

## 🎯 Most Common Issues

### Issue 1: `src_scheme: "L-Unknown-Unknown"`
**Cause:** Scheme codes not populated from API  
**Fix:** Check if `/master_scheme_list` returns `parent_scheme_code` or `scheme_isin`

### Issue 2: Using demo ARN
**Cause:** `VITE_STARMF_ARN` not configured  
**Fix:** Add to `.env`: `VITE_STARMF_ARN=ARN-XXXXX`

### Issue 3: `INVALID_SCHEME` error
**Cause:** Scheme code format wrong or not recognized by BSE  
**Fix:** Verify scheme code format from API response

### Issue 4: `INVALID_MEMBER` error
**Cause:** ARN not registered with BSE  
**Fix:** Use correct ARN that's registered with BSE

---

## 📸 How to Copy Console Logs

1. Right-click in console
2. Select "Save as" → Save to file
3. Or select all logs (Ctrl+A) → Copy (Ctrl+C) → Paste in text editor

---

## 🚀 Next Steps

1. Open browser console (F12)
2. Trigger SIP flow
3. Check logs in order above
4. Identify which step is failing
5. Share the relevant logs
6. We'll fix the specific issue
