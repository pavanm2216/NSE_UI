# BSE Real API Integration - Setup Guide

## What Changed

Now using **real BSE API** instead of mock data.

### Files Updated

1. ✅ `src/services/bseAuth.ts` - Calls `/api/bse/login` endpoint
2. ✅ `vite.config.ts` - Added proxy for `/api/bse` to backend
3. ✅ `server/src/routes/bseAuthRoutes.js` - New backend endpoint
4. ✅ `server/index.js` - Registered BSE auth routes

---

## How It Works

```
Frontend (8081)
  ↓
POST /api/bse/login
  ↓
Vite Proxy (routes to localhost:5000)
  ↓
Backend (5000)
  ↓
POST https://starmfv2demo.bseindia.com/api/login
  ↓
BSE API returns access_token
  ↓
Backend returns to frontend
  ↓
Frontend shows success
```

---

## Setup Steps

### Step 1: Verify Backend Configuration

Check `server/.env` has BSE credentials:

```bash
cat server/.env | grep STARMF
```

Should show:
```env
STARMF_BASE_URL=https://starmfv2demo.bseindia.com/api
STARMF_USERNAME=member/92374/lendrixventechprivatelimited
STARMF_PASSWORD=Member@123
```

### Step 2: Restart Backend

```bash
cd server
npm run dev
```

Expected output:
```
[Server] Running on http://localhost:5000
```

### Step 3: Restart Frontend

In another terminal:
```bash
npm run dev
```

Expected output:
```
VITE v8.1.0  ready in 123 ms
➜  Local:   http://localhost:8081/
```

### Step 4: Test Login

1. Go to: `http://localhost:8081/mf-login`
2. Click "BSE StAR MF" tab
3. Enter credentials:
   - Username: `member/92374/lendrixventechprivatelimited`
   - Password: `Member@123`
4. Click "Connect to BSE"

### Step 5: Expected Result

✅ Green checkmark + "BSE StAR MF Connected"

---

## Test Cases

### Test 1: Valid Credentials
```
Username: member/92374/lendrixventechprivatelimited
Password: Member@123
Expected: Success ✅
```

### Test 2: Invalid Credentials
```
Username: invalid/user
Password: wrongpass
Expected: "Invalid BSE credentials" ❌
```

### Test 3: Empty Username
```
Username: (empty)
Password: Member@123
Expected: "Member username is required" ❌
```

### Test 4: Empty Password
```
Username: member/92374/lendrixventechprivatelimited
Password: (empty)
Expected: "Password is required" ❌
```

---

## Troubleshooting

### Issue: "Unable to connect to BSE StAR MF"
**Cause**: Backend not running or network error

**Fix**:
```bash
cd server
npm run dev
```

### Issue: "Invalid BSE credentials"
**Cause**: Wrong username or password

**Fix**: Use correct demo credentials:
```
Username: member/92374/lendrixventechprivatelimited
Password: Member@123
```

### Issue: 404 Error
**Cause**: Vite proxy not configured

**Fix**: Restart frontend
```bash
npm run dev
```

### Issue: Backend crashes
**Cause**: Missing dependencies

**Fix**:
```bash
cd server
npm install
npm run dev
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│ React Frontend (8081)                   │
│ - MFLoginPage.tsx                       │
│ - bseAuth.ts (calls /api/bse/login)     │
└────────────────┬────────────────────────┘
                 │
                 │ POST /api/bse/login
                 │ (Vite Proxy)
                 ↓
┌─────────────────────────────────────────┐
│ Express Backend (5000)                  │
│ - bseAuthRoutes.js                      │
│ - Calls BSE API                         │
└────────────────┬────────────────────────┘
                 │
                 │ POST /login
                 │ (Server-to-Server)
                 ↓
┌─────────────────────────────────────────┐
│ BSE StAR MF Demo API                    │
│ https://starmfv2demo.bseindia.com/api   │
│ - Returns access_token                  │
└─────────────────────────────────────────┘
```

---

## Security

✅ Credentials stored in `server/.env`
✅ Never exposed to frontend
✅ Backend handles all BSE communication
✅ Token stored server-side
✅ CORS handled properly

---

## Files Structure

```
server/
├── index.js (updated - added bseAuthRoutes)
├── .env (has BSE credentials)
└── src/
    ├── routes/
    │   ├── bseAuthRoutes.js (new - handles /api/bse/login)
    │   └── starmfRoutes.js (existing)
    └── config/
        └── env.js (reads .env)

src/
├── services/
│   └── bseAuth.ts (updated - calls /api/bse/login)
└── pages/
    └── auth/
        └── MFLoginPage.tsx (uses bseAuth)

vite.config.ts (updated - added /api/bse proxy)
```

---

## Next Steps

1. ✅ Verify backend configuration
2. ✅ Start backend: `cd server && npm run dev`
3. ✅ Start frontend: `npm run dev`
4. ✅ Test login with demo credentials
5. ✅ Verify green checkmark appears

---

## Demo Credentials

```
Username: member/92374/lendrixventechprivatelimited
Password: Member@123
```

---

## Summary

✅ Real BSE API integrated
✅ Backend handles authentication
✅ Frontend calls backend endpoint
✅ Credentials server-side only
✅ Ready for testing
