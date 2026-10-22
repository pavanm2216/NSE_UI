# Quick Action Guide - Scheme Code Issue

## 🎯 What to Do Now

### Step 1: Run the App
```bash
npm run dev
```

### Step 2: Open Browser Console
Press `F12` → Go to **Console** tab

### Step 3: Trigger SIP Flow
1. Select a fund
2. Click "BUY NOW"
3. Select "Start a SIP"
4. Fill amount and click "Confirm"

### Step 4: Check Console for This Log
Look for:
```
[Scheme Debug] First scheme - ALL FIELDS:
```

Copy the entire output and share it.

---

## 📋 What to Look For

### The Log Will Show:
```javascript
{
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  parent_scheme_code: "",
  scheme_isin: "",
  scheme_code: "???",        ← What's here?
  scheme_id: "???",          ← Or here?
  scheme_amc_code: "SBI",
  scheme_rta_code: "...",
  ... (other fields)
}
```

### Key Questions:
- [ ] Is `scheme_code` populated? (not empty)
- [ ] Is `scheme_id` populated? (not empty)
- [ ] Is there any other field with a code-like value?

---

## 🔍 Example Outputs

### ✅ GOOD - scheme_code exists:
```
scheme_code: "SBIESIGGR"
```
→ We can use this!

### ✅ GOOD - scheme_id exists:
```
scheme_id: "12345"
```
→ We can use this!

### ❌ BAD - All empty:
```
scheme_code: ""
scheme_id: ""
```
→ We'll generate from name: "SBI-ESG-EXCL-GR"

---

## 📸 How to Share the Log

1. Right-click in console
2. Select "Save as" → Save to file
3. Or copy-paste the `[Scheme Debug]` section

---

## 🚀 What Happens Next

### If scheme_code or scheme_id exists:
✅ System will use it automatically
✅ SIP registration should work

### If all fields are empty:
⚠️ System generates code from name
⚠️ Generated code may not work with BSE API
→ We need to find the correct field or contact BSE

---

## 💡 Pro Tips

### Tip 1: Check Multiple Schemes
The log shows first 5 schemes. Check if they all have the same issue:
```
[Scheme Debug] First 5 schemes: [
  { name: "...", scheme_code: "???" },
  { name: "...", scheme_code: "???" },
  ...
]
```

### Tip 2: Check Schemes Without Code
```
[Scheme Debug] Schemes without any code: 45
```
If this number is high, the API might not be returning codes at all.

### Tip 3: Look for Pattern
Check if there's a pattern in the field names:
- `scheme_code`
- `scheme_id`
- `code`
- `id`
- Something else?

---

## 📞 When to Share

Share the console logs when you see:
1. `[Scheme Debug] First scheme - ALL FIELDS:` output
2. `[Scheme Code Resolution]` output
3. Any error messages

---

## ⏱️ Time to Fix

- **If scheme_code exists:** Already fixed! ✅
- **If scheme_id exists:** Already fixed! ✅
- **If different field:** 5 minutes to update resolver
- **If no field exists:** Need to contact BSE for mapping

---

## 🎓 Understanding the Solution

### Before (Broken):
```
parent_scheme_code = ""
isin = ""
Result: "L-Unknown-Unknown" ❌
```

### After (Fixed):
```
Check: parent_scheme_code → empty
Check: isin → empty
Check: scheme_code → "SBIESIGGR" ✅
Result: "SBIESIGGR" ✅
```

### Fallback (If all empty):
```
Check: all fields → empty
Generate: from name → "SBI-ESG-EXCL-GR"
Result: "SBI-ESG-EXCL-GR" (may not work with API)
```

---

## ✅ Checklist

- [ ] App is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] SIP flow triggered
- [ ] Found `[Scheme Debug]` log
- [ ] Identified which field has the code
- [ ] Ready to share the output

---

## 🎯 Next Steps

1. **Run the app**
2. **Check the console**
3. **Share the `[Scheme Debug]` output**
4. **We'll fix it based on what field exists**

That's it! The system will automatically use whatever scheme code field is available. 🚀
